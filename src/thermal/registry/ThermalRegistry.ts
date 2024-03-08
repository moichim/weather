"use client";

import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalEvents, ThermalEventsFactory } from "./events";
import { ThermalRangeOrUndefined } from "./interfaces";

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
        this.getGroupsArray().forEach( group => group.destroySelf() );
    }





    /** 
     * Activation status 
    */


    protected onRecieveActivationStatus(status: boolean): void {
        this.getGroupsArray().forEach( group => group.recieveActivationStatus( status ) );
    }

    protected onImposeActivationStatus(status: boolean): void {
        this.onRecieveActivationStatus( status );
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

            group.addEventListener( ThermalEvents.GROUP_LOADING_FINISH, () => {

                const all = this.getGroupsArray().reduce( ( state, current ) => {
                    if ( current.isLoading )
                        return false;
                    return state
                }, true );

                if ( all ) {

                    this.dispatchEvent( ThermalEventsFactory.ready() );

                }

            } );

            return group;
        }

        return this.groups[id];
    }

    public removeGroup( id: string ) {

        const group = this.groups[ id ];

        if ( group ) {

            group.destroySelf();

            delete this.groups[ id ];

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



}