"use client";

import { ProjectDescription } from "../context/useProjectLoader";
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalManager } from "./ThermalManager";
import { ThermalFileRequest } from "./ThermalRequest";
import { IThermalRegistry } from "./interfaces/interfaces";
import { GroupsState } from "./properties/lists/groups/GroupsState";
import { HighlightDrive } from "./properties/drives/highlight/HighlightDrive";
import { HistogramState } from "./properties/states/histogram/HistogramState";
import { LoadingState } from "./properties/states/loading/LoadingState";
import { MinmaxRegistryProperty } from "./properties/states/minmax/registry/MinmaxRegistryState";
import { OpacityDrive } from "./properties/drives/opacity/OpacityDrive";
import { PaletteDrive } from "./properties/drives/palette/PaletteDrive";
import { RangeDriver } from "./properties/drives/range/RangeDriver";
import { ThermalRegistryLoader } from "./utilities/ThermalRegistryLoader";

/**
 * The global thermal registry
 * @todo implementing EventTarget
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
    public readonly groups: GroupsState = new GroupsState( this, [] );



    /** Iterator methods */

    public forEveryGroup( fn: ( ( group: ThermalGroup ) => any ) ) {
        this.groups.value.forEach( fn );
    }

    public forEveryInstance( fn: ( instance: ThermalFileInstance ) => any ) {
        this.forEveryGroup( group => group.instances.forEveryInstance( fn ) );
    }

    /** @deprecated Not used, but functional */
    public filterInstances( fn: ( (instance: ThermalFileInstance) => boolean ) ) {
        const result: ThermalFileInstance[] = [];

        this.groups.value.forEach( group => {

            group.instances.value.forEach( instance => {
                
                if ( fn( instance ) ) {
                    result.push( instance );
                }

            });

        } );

        return result;
    }



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

        // Recalculate individual minmaxes
        this.forEveryGroup( group => group.minmax.recalculateFromInstances() );

        // Recalculate the minmax
        this.minmax.recalculateFromGroups();

        // If there is minmax, impose it down
        if ( this.minmax.value )
            this.range.imposeRange( {from: this.minmax.value.min, to: this.minmax.value.max} );

        // Recalculate the histogram
        this.histogram.recalculateWithCurrentSetting();

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

        // Recalculate individual minmaxes
        this.forEveryGroup( group => group.minmax.recalculateFromInstances() );

        // Recalculate the minmax
        this.minmax.recalculateFromGroups();

        // If there is minmax, set it as range
        if ( this.minmax.value )
            this.range.imposeRange( {from: this.minmax.value.min, to: this.minmax.value.max} );

        // Recalculate the histogram
        this.histogram.recalculateWithCurrentSetting();

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

    public destroySelfAndBelow() {
        this.reset();
    }








    /**
     * Observable properties and drives
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
    public readonly loading: LoadingState = new LoadingState( this, false );

    /**
     * Range
     */
    public readonly range: RangeDriver = new RangeDriver( this, undefined );

    /**
     * Histogram
     */
    public readonly histogram: HistogramState = new HistogramState( this, [] );

    /**
     * Palette
     */
    public readonly palette: PaletteDrive = new PaletteDrive( this, "jet" );


    /**
     * Highlight
     */
    public readonly highlight: HighlightDrive = new HighlightDrive( this, undefined );










    protected test() {
        this.opacity.addListener( "test", value => {console.log( value );} );
    }








    /**
     * Groups creation
     */
    /** Create a group or get an existing instance @deprecated */
    public addOrGetGroup(
        id: string
    ) {
        return this.groups.addOrGetGroup(id);
    }



}

export type ThermalStatistics = {
    from: number,
    to: number,
    percentage: number,
    count: number,
    height: number
}