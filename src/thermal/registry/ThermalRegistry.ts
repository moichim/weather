import { ThermalFileSource } from "../reader/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined, ThermalSourceAddedEventDetail } from "./interfaces";

export class ThermalRegistry extends ThermalObjectContainer {

    public static SOURCE_REGISTERED_EVENT = "sourceregistered";

    protected groups: {
        [index: string]: ThermalGroup
    } = {}
    protected getGroupsArray() {
        return Object.values( this.groups );
    }

    protected sourcesByUrl: {
        [index: string]: ThermalFileSource
    } = {}
    protected getSourcesArray() {
        return Object.values( this.sourcesByUrl );
    }
    protected getRegisteredUrls() {
        return Object.keys( this.sourcesByUrl );
    }
    protected registerSource(
        source: ThermalFileSource
    ) {
        if ( ! this.getRegisteredUrls().includes( source.url ) ) {

            // Assign the source
            this.sourcesByUrl[source.url] = source;

            // Update the min max locally
            if ( this.minmax === undefined ) {
                this._minmax = { min: source.min, max: source.max };
            } else if ( this.minmax !== undefined ) {
                if ( this.minmax.min > source.min ) 
                    this.minmax.min = source.min;
                if ( this.minmax.max < source.max )
                    this.minmax.max = source.max;
            }

            // Emit the minmax event
            this.dispatchMinmaxEvent( false );

            // Emit the loaded event
            this.dispatchSourceRegisterEvent( source );

        }
    }

    protected dispatchSourceRegisterEvent(
        source: ThermalFileSource
    ) {
        this.dispatchEvent( new CustomEvent<ThermalSourceAddedEventDetail>(
            ThermalRegistry.SOURCE_REGISTERED_EVENT,
            {
                detail: {
                    source: source
                }
            }
        ) );
    }



    /**
     * Range
     */

    /**
     * Range set
     * = propaguj do všech grup
     * = ulož lokálně
     * = emituj event
     */
    
    public imposeRange( value: ThermalRangeOrUndefined ) {
        this.range = value;
        this.getGroupsArray().forEach( group => group.recieveRange( value ) );
        this.dispatchRangeEvent( true )
    }

    /**
     * Minmax
     */

    /**
     * Minmax set
     * = propaguj do vsšch grup
     * = ulož lokálně
     * = emituj event
     */
    protected imposeMinmax( value:  ThermalMinmaxOrUndefined ) {
        this.minmax = value;
        if ( this.minmax !== undefined ) {
            this.getGroupsArray().forEach( group => group.recieveMinmax( this.minmax ) );
        }
    }


    /**
     * Opacity
     */
    public imposeOpacity( value: number ) {
        this.opacity = value;
        this.getGroupsArray().forEach( group => group.recieveOpacity( value ) );
        this.dispatchOpacityEvent();
    }

}