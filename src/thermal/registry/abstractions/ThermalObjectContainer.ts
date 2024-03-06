import { ThermalEventsFactory } from "../events";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { ThermalObjectBase } from "./ThermalObjectBase";

/**
 * Properties that are common to groups and the registry
 */
export abstract class ThermalObjectContainer extends ThermalObjectBase {

    protected _minmax: ThermalMinmaxOrUndefined;
    public get minmax() { return this._minmax }
    protected set minmax( value: ThermalMinmaxOrUndefined ) {
        this._minmax = value;
        this.dispatchEvent( ThermalEventsFactory.minmaxUpdated( value ) );
    }

}