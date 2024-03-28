"use client";

import { NumberDomain } from "recharts/types/util/types";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { GroupLoadingEvent, ThermalEvents, ThermalEventsFactory } from "./events";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "./interfaces";
import { GRAYSCALE, PALETTE, ThermalPalettes } from "../file/palettes";
import { addHours } from "date-fns";
import { ThermalManager } from "./ThermalManager";
import { ThermalFileRequest, ThermalRequest } from "./ThermalRequest";
import { ThermalRegistryLoader } from "./utilities/ThermalRegistryLoader";
import { IWithOpacity, OpacityDrive } from "./properties/OpacityDrive";
import { ProjectDescription } from "../context/useProjectLoader";
import { LoadingProperty } from "./properties/LoadingProperty";
import { GroupsProperty } from "./properties/GroupProperty";
import { IThermalContainer, IThermalRegistry } from "./interfaces/interfaces";
import { MinmaxRegistryProperty } from "./properties/MinmaxRegistryProperty";
import { RangeDriver } from "./properties/RangeDriver";
import { HistogramProperty } from "./properties/HistogramProperty";

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
export class ThermalRegistry implements IThermalRegistry {

    public readonly hash = Math.random();

    public constructor(
        public readonly id: string,
        public readonly manager: ThermalManager
    ) {
        // super();
    }

    /** Takes care of the entire loading */
    protected readonly loader: ThermalRegistryLoader = new ThermalRegistryLoader( this );
    
    

    /** Groups are stored in an observable property */
    public readonly groups: GroupsProperty = new GroupsProperty( this, [] );



    /**
     * 
     * 1. resets everything
     * 2. set as loading (T)
     * 3. create the groups and register their filed
     * 4. fetch all requests (this will register and instantiate the sources)
     * 5. mark as loaded
     * 6. return the groups
     */
    public async loadProject(
        description: ProjectDescription
    ): Promise<ThermalGroup[]> {

        this.loading.markAsLoading();

        // Reset everything at first
        this.reset();

        // Create the groups from the definition
        for ( const groupId in description ) {

            const group = this.groups.addOrGetGroup( groupId );

            // Request the files
            this.loader.requestFiles( group, description[groupId].files );

        }

        // Resolve the query and create the instances where they should be
        await this.loader.resolveQuery();

        // Recalculate the minmax
        this.minmax.recalculateFromGroups();

        // If there is minmax, impose it down
        if ( this.minmax.value )
            this.range.imposeRange( {from: this.minmax.value.min, to: this.minmax.value.max} );

        // Recalculate the histogram
        this.histogram.recalculate();

        this.loading.markAsLoaded();

        return this.groups.value;

    }

    public async loadOneFile( file: ThermalFileRequest, groupId: string ): Promise<ThermalGroup> {

        this.loading.markAsLoading();

        this.reset();

        const group = this.groups.addOrGetGroup( groupId );

        this.loader.requestFile( group, file.thermalUrl, file.visibleUrl );

        // Resolve the entire query
        await this.loader.resolveQuery();

        // Recalculate the minmax
        this.minmax.recalculateFromGroups();

        // If there is minmax, impose it down
        if ( this.minmax.value )
            this.range.imposeRange( {from: this.minmax.value.min, to: this.minmax.value.max} );

        // Recalculate the histogram
        this.histogram.recalculate();

        this.loading.markAsLoaded();

        return this.groups.map.get( groupId ) as ThermalGroup

    }



    public reset() {
        this.removeAllChildren();
        this.opacity.reset();
        this.minmax.reset();
    }

    public removeAllChildren() {
        this.groups.removeAllGroups();
    };

    public destroySelfAndBelow() {}




    /**
     * Properties
     */


    /** 
     * Opacity property 
     */
    public readonly opacity: OpacityDrive = new OpacityDrive( this, 1 );

    /** 
     * Minmax property 
     */
    public readonly minmax: MinmaxRegistryProperty = new MinmaxRegistryProperty( this, undefined );

    /**
     * Loading
     */
    public readonly loading: LoadingProperty = new LoadingProperty( this, false );

    /**
     * Range
     */
    public readonly range: RangeDriver = new RangeDriver( this, undefined );

    /**
     * Histogram
     */
    public readonly histogram: HistogramProperty = new HistogramProperty( this, [] );




    protected test() {
        this.opacity.addListener( "test", value => {console.log( value );} );
    }



    protected clearListeners() {
        this.opacity.clearAllListeners();
    }





    /** 
     * Activation status 
    */


    protected onRecieveActivationStatus(status: boolean): void {
        this.groups.value.forEach(group => group.recieveActivationStatus(status));
    }

    protected onImposeActivationStatus(status: boolean): void {
        this.onRecieveActivationStatus(status);
    }







    /**
     * Groups creation
     */
    /** Create a group or get an existing instance */
    public addOrGetGroup(
        id: string
    ) {
        return this.groups.addOrGetGroup(id);
    }




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

    /** Completely calculate the minmax and set it also as the range */
    protected recalculateMinmaxAndRange() {
        this.minmax = this._getMinmaxFromAllGroups();
        if (this.minmax) {
            this.range = { from: this.minmax.min, to: this.minmax.max };
        }
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