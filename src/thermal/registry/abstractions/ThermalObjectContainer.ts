import { ThermalMinmaxEventDetail, ThermalMinmaxOrUndefined } from "../interfaces";
import { ThermalObjectBase } from "./ThermalObjectBase";

/**
 * Properties that are common to groups and the registry
 */
export abstract class ThermalObjectContainer extends ThermalObjectBase {

    // Event types
    public static MINMAX_EVENT = "minmaxevent";


    protected _minmax: ThermalMinmaxOrUndefined;
    public get minmax() { return this._minmax }
    protected set minmax( value: ThermalMinmaxOrUndefined ) {
        this._minmax = value;
    }

    protected dispatchMinmaxEvent(
        impose: boolean = false
    ) {
        this.dispatchEvent( new CustomEvent<ThermalMinmaxEventDetail>( 
            ThermalObjectContainer.MINMAX_EVENT,
            {
                detail: {
                    minmax: this.minmax,
                    imposed: impose
                }
            }
         ) )
    }

}