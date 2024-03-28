"use client";

import { NumberDomain } from "recharts/types/util/types";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { GroupLoadingEvent, ThermalEvents, ThermalEventsFactory } from "./events";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "./interfaces";
import { GRAYSCALE, PALETTE, ThermalPalettes } from "../file/palettes";
import { addHours } from "date-fns";

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


    /** 
     * Loading states 
     */

    protected onSetStateEmpty(): void {
        this.removeAllChildren();
    }
    protected onSetStateLoading(): void {
        // this.getGroupsArray().forEach( group => group.recieveActivationStatus( false ) );
    }
    protected onSetStateLoaded(): void {
        this.recalculateAllParameters();
    }

    /** Internal buffer holding IDs of all currently loading groups */
    protected _groupsLoading: string[] = [];
    
    /** Indicate one group as loading and set the global state */
    public groupStartedLoading(
        groupId: string
    ) {

        if ( ! this._groupsLoading.includes( groupId ) ) {
            this._groupsLoading.push( groupId );
            this.setStateLoading();
        }
    }

    /** Indicate one group as loaded and set the global state */
    public groupFinisledLoading( 
        groupId: string 
    ) {

        if ( this._groupsLoading.includes( groupId ) ) {
            this._groupsLoading = this._groupsLoading.filter( g => g !== groupId );
            if ( this._groupsLoading.length === 0 ) {
                console.log( "Nyní by měl stav registru skočit na načtený" );
                this.setStateLoaded();
            }
        }
    }

    /** Resolve requests for all groups having any requests and return the affected groups */
    public async resolveAllGroups() {

        const result = await Promise.all(
            this.getGroupsArray()
                .filter( group => group.requests.length > 0 )
                .map( group => group.resolveQuery() )
        );

        return result;

    }


    public readonly hash = Math.random();

    /**
     * Destruction
     */

    protected onDestroySelf(): void {
        this.removeAllChildren();
        this.minmax = undefined;
        this.range = undefined;
        this.histogram = [];
    }

    protected removeAllChildren() {
        for ( let group of this.getGroupsArray() ) {
            group.destroySelf();
            delete this.groups[group.id];
        }
    }

    /** Remove a single group and recalculate the parameters work
    */
    public removeGroup(id: string) {

        const group = this.groups[id];

        if (group) {

            group.destroySelf();

            delete this.groups[id];

            // If there are no groups left, mark the state as empty
            if ( this.getGroupsArray().length === 0 ) {
                this.setStateEmpty();
            } 
            // If there are some groups, recalculate the parameters
            else {
                this.recalculateAllParameters();
            }
        }

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
     * Groups creation
     */

    protected _groups: {
        [index: string]: ThermalGroup
    } = {}
    protected get groups() { return this._groups }
    public getGroupsArray = () => Object.values(this.groups);
    public getGroupsById = () => this._groups;
    protected _isGroupRegistered = (id: string) => this.groups[id] !== undefined;
    /** Create a group or get an existing instance */
    public addOrGetGroup(
        id: string
    ) {
        if (!this._isGroupRegistered(id)) {

            const group = new ThermalGroup(this, id);
            this.groups[id] = group;
            this.dispatchEvent(
                ThermalEventsFactory.groupInit(group)
            );

            return group;
        }

        return this.groups[id];
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
    public isUrlRegistered = (url: string) => Object.keys(this.sourcesByUrl).includes(url);



    /**
     * Parameters recalculation
     * - minmax
     * - range
     * - histogram
     */

    public recalculateAllParameters(): void {
        this.recalculateMinmaxAndRange();
        // this.histogram = this._getHistorgramFromAllGroups();
    }

    /** 
     * The current histogram should be calculated everytime when:
     * - the groups are loaded
     * - the group is added
     * 
    */
    public histogram: ThermalStatistics[] = [];


    /** Calculate a histogram of all groups */
    public _getHistorgramFromAllGroups() {

        if (this.minmax === undefined || this.getGroupsArray().length === 0) {
            return [];
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

            const numSegments = 50;
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

                const count = allPixels.filter( pixel => {
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

    /** Completely calculate the minmax and set it also as the range */
    protected recalculateMinmaxAndRange() {
        this.minmax = this._getMinmaxFromAllGroups();
        if (this.minmax) {
            this.range = { from: this.minmax.min, to: this.minmax.max };
        }
    }

    /** Internal method for calculation of minmax from current groups  */
    protected _getMinmaxFromAllGroups(): ThermalMinmaxOrUndefined {

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
     * Global parameters
     */









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
     * @deprecated Should not be used at all! Instead, read the histogram from the variable!
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


    /**
     * Palette
     */

    public readonly palettes = {
        iron: PALETTE
    }

    public readonly _availablePalettes = ThermalPalettes;

    public get availablePalettes() {
        return this._availablePalettes;
    }

    protected _activePalette: keyof typeof ThermalPalettes = "jet";
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



    protected _highlightTime?: number;
    public get hightlightTime() {
        return this._highlightTime;
    }
    public set hightlightTime(
        value: number | undefined
    ) {
        this._highlightTime = value;
        if ( value !== undefined ) {
            const min = this._getHourDown( value );
            const max = this._getHourUp( value );
            this.getGroupsArray().forEach( group => {
                group.getInstancesArray().forEach( instance => {
                    if ( instance.timestamp >= min && instance.timestamp <= max ) {
                        instance.highlight( true );
                    } else {
                        instance.highlight( false );
                    }
                } );
            } );
        }
        else {
            this.getGroupsArray().forEach( group => group.getInstancesArray().forEach( instance => {
                instance.highlight(false)
            } ) )
        }
    }

    protected _getHourDown(
        timestamp: number
    ): number {
        const d = new Date();
        d.setTime( timestamp );
        return addHours(d, -1).getTime();
    }

    protected _getHourUp(
        timestamp: number
    ): number {
        const d = new Date();
        d.setTime( timestamp );
        return addHours(d, 1).getTime();
    }



}

export type ThermalStatistics = {
    from: number,
    to: number,
    percentage: number,
    count: number,
    height: number
}