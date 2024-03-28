import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalRangeOrUndefined } from "../interfaces";
import { AbstractProperty, IBaseProperty } from "./abstractProperty";

export interface IWithRange extends IBaseProperty {}

export class RangeDriver extends AbstractProperty< ThermalRangeOrUndefined, ThermalRegistry> {

    protected validate(value: ThermalRangeOrUndefined): ThermalRangeOrUndefined {
        return value;
    }

    // Whenever the range changes, propagate it below
    protected afterSetEffect(value: ThermalRangeOrUndefined) {
    
        if ( value )
            this.parent.groups.value.forEach( group => group.getInstancesArray().forEach( instance => instance.recieveRange( value ) ) );

    }


    /** Imposes a range to itself and below */
    public imposeRange( value: ThermalRangeOrUndefined ) {
        
        // If new and old are undefined, do nothing
        if ( value === undefined && this.value === undefined ) {
            // ..do nothing
        }
        // If the new one is undefined and old one exists, set undefined
        else if ( value === undefined && this.value !== undefined ) {
            this.value = value;
        } 
        // If there is no value and the new one exists
        if ( value !== undefined && this.value === undefined ) {
            this.value = value;
        }
        // If the value changes...
        else if ( value !== undefined && this.value !== undefined ) {

            // ... set it only if it is different
            if ( this.value.from !== value.from || this.value.to !== value.to ) {
                this.value = value;
            }

        }
    }

}