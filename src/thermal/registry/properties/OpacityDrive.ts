import { ThermalRegistry } from "../ThermalRegistry";
import { AbstractProperty, IBaseProperty } from "./abstractProperty";

export interface IWithOpacity extends IBaseProperty {
    opacity: OpacityDrive
}

export class OpacityDrive extends AbstractProperty<number, ThermalRegistry> {

    /** Make sure the value is allways between 0 and 1 */
    protected validate(value: number): number {
        return Math.min( Math.max( 0, value ), 1 );
    }

    protected afterSetEffect(value: number) {

        this.parent.groups.value.forEach( group => group.getInstancesArray().forEach( instance => instance.recieveOpacity( value ) ) );

    }

    /** Impose an opacity to all instances */
    public imposeOpacity(
        value: number
    ) {
        this.value = value;
    }

    

}