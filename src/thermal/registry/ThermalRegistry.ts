"use client";

import { NumberDomain } from "recharts/types/util/types";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalEvents, ThermalEventsFactory } from "./events";
import { ThermalRangeOrUndefined } from "./interfaces";
import { GRAYSCALE, PALETTE, ThermalPalettes } from "../file/palettes";

/**
 * The global thermal registry
 * 
 * Creation:
 * - the singleton should by stored globally and all groups and instances need to be part of this singleton
 * 
 * Events:
 * - ThermalEvents.GROUP_INIT
 * - ThermalEvents.MINMAX_UPDATED
 * - ThermalEvents.OPACITY_UPDATED
 * - ThermalEvents.RANGE_UPDATED
 * - ThermalEvents.READY
 */
export class ThermalRegistry extends ThermalObjectContainer {


    public readonly hash = Math.random();

    protected onDestroySelf(): void {
        this.getGroupsArray().forEach(group => group.destroySelf());
    }





    /** 
     * Activation status 
    */


    protected onRecieveActivationStatus(status: boolean): void {
        this.getGroupsArray().forEach(group => group.recieveActivationStatus(status));
    }

    protected onImposeActivationStatus(status: boolean): void {
        this.onRecieveActivationStatus(status);
    }







    /**
     * Groups
     */

    protected _groups: {
        [index: string]: ThermalGroup
    } = {}
    public get groups() { return this._groups }
    protected getGroupsArray() {
        return Object.values(this.groups);
    }
    protected isGroupRegistered(id: string) {
        return this.groups[id] !== undefined;
    }
    public addOrGetGroup(
        id: string
    ) {
        if (!this.isGroupRegistered(id)) {

            const group = new ThermalGroup(this, id);
            this.groups[id] = group;
            this.dispatchEvent(
                ThermalEventsFactory.groupInit(group)
            );

            group.addEventListener(ThermalEvents.GROUP_LOADING_FINISH, () => {

                const all = this.getGroupsArray().reduce((state, current) => {
                    if (current.isLoading)
                        return false;
                    return state
                }, true);

                if (all) {

                    this.dispatchEvent(ThermalEventsFactory.ready());

                }

            });

            return group;
        }

        return this.groups[id];
    }

    public removeGroup(id: string) {

        const group = this.groups[id];

        if (group) {

            group.destroySelf();

            delete this.groups[id];

            this.recalculateMinmax();
        }

    }



    /**
     * Sources handling
     */


    protected _sourcesByUrl: {
        [index: string]: ThermalFileSource
    } = {}
    public get sourcesByUrl() { return this._sourcesByUrl; }
    protected getSourcesArray() {
        return Object.values(this.sourcesByUrl);
    }
    protected getRegisteredUrls() {
        return Object.keys(this.sourcesByUrl);
    }
    public registerSource(
        source: ThermalFileSource
    ) {
        if (!this.getRegisteredUrls().includes(source.url)) {

            // Assign the source
            this.sourcesByUrl[source.url] = source;

            // Emit the loaded event
            this.dispatchEvent(ThermalEventsFactory.sourceRegistered(source));

            return source;

        }

        return this.sourcesByUrl[source.url];
    }
    public isUrlRegistered(url: string) {
        return Object.keys(this.sourcesByUrl).includes(url);
    }



    /**
     * Parameters recalculation
     */

    public recalculateParameters(): void {
        this.recalculateMinmax();
    }






    /**
     * Range
     */

    public imposeRange(value: ThermalRangeOrUndefined) {
        this.range = value;
    }

    protected onRangeUpdated(value: ThermalRangeOrUndefined): void {
        this.getGroupsArray().forEach(group => group.recieveRange(value));
    }






    /**
     * Minmax
     */
    public recalculateMinmax() {
        this.minmax = this.calculateMinmaxFromGroups();
        if (this.minmax) {
            this.range = { from: this.minmax.min, to: this.minmax.max };
        }
    }

    protected calculateMinmaxFromGroups() {

        const groups = this.getGroupsArray();

        if (groups.length === 0) {
            return undefined;
        }

        const minmax = groups.reduce((state, current) => {

            if (current.minmax === undefined) {
                return state;
            }

            return {
                min: current.minmax.min < state.min ? current.minmax.min : state.min,
                max: current.minmax.max > state.max ? current.minmax.max : state.max
            }

        }, { min: Infinity, max: -Infinity });

        return minmax;

    }






    /**
     * Opacity
     */
    public imposeOpacity(value: number) {
        this.opacity = value;
    }

    protected onOpacityUpdated(value: number): void {
        this.getGroupsArray().forEach(group => group.recieveOpacity(value));
    }



    /**
     * Statistics processing
     */

    public async getStatistics() {

        if (this.minmax === undefined || this.getGroupsArray().length === 0) {
            return await [];
        } else {

            // Get all pixels
            const allPixels = this.getGroupsArray().reduce((
                state,
                current
            ) => {

                const pixels = current.getInstancesArray().reduce((buf, instance) => {

                    buf = [...buf, ...instance.pixels];

                    return buf;

                }, [] as number[]);

                return [...state, ...pixels]

            }, [] as number[]);


            // Calculate the ten segments
            const segments: [number, number][] = [];

            const numSegments = 100;
            const difference = this.minmax.max - this.minmax.min;
            const segment = difference / numSegments;

            for (let i = 0; i < numSegments; i++) {

                const from = (segment * i) + this.minmax.min;
                const to = from + segment;

                segments.push([from, to]);

            }

            const results: {
                from: number,
                to: number,
                count: number
            }[] = [];

            let sum = allPixels.length;

            for ( let i of segments ) {

                const count = await allPixels.filter( pixel => {
                    return pixel >= i[0] && pixel < i[1]; 
                }).length;

                sum = sum + count;

                results.push( {
                    from: i[0],
                    to: i[1],
                    count: count
                } );

            }

            

            const recalculated = results.map( i => {
                return {
                    ...i,
                    percentage: i.count / sum * 100,
                }
            } );

            const max = Math.max( ...recalculated.map( item => item.percentage ) );

            return recalculated.map( item => {
                return {
                    ...item,
                    height: item.percentage / max * 100
                }
            } ) as ThermalStatistics[];

        }


    }

    public readonly palettes = {
        iron: PALETTE
    }

    public readonly _availablePalettes = ThermalPalettes;

    public get availablePalettes() {
        return this._availablePalettes;
    }

    protected _activePalette: keyof typeof ThermalPalettes = "iron";
    public set palette( value: keyof typeof ThermalPalettes ) {
        this._activePalette = value;
        this.getGroupsArray().forEach( group => group.getInstancesArray().forEach( instance => instance.draw() ) );
        this.dispatchEvent( ThermalEventsFactory.paletteChanged( value ) );
    }
    public get palette() {
        return this._activePalette;
    }

    public get currentPalette() {
        return this._availablePalettes[ this._activePalette ];
    }

    public get activePalette() {
        return this._availablePalettes[ this._activePalette ].pixels;    
    }



}

export type ThermalStatistics = {
    from: number,
    to: number,
    percentage: number,
    count: number,
    height: number
}