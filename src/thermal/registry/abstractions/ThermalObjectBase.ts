import { ThermalEventsFactory } from "../events";
import { ThermalRangeOrUndefined } from "../interfaces";

/**
 * Core methods and properties that are shared across files, groups and the registry
 */
export abstract class ThermalObjectBase extends EventTarget {


    // Range


    protected _range: ThermalRangeOrUndefined;
    public get range() { return this._range; }
    protected set range( value:  ThermalRangeOrUndefined ) { 
        this._range = value;
        this.dispatchEvent( ThermalEventsFactory.rangeUpdated( value ) );
        this.onRangeUpdated( value );
    }

    protected abstract onRangeUpdated( value: ThermalRangeOrUndefined ): void;
    

    // Opacity

    protected _opacity: number = 1;
    public get opacity() { return this._opacity }
    protected set opacity( value: number ) {
        this._opacity = value;
        this.dispatchEvent( ThermalEventsFactory.opacityUpdated( value ) );
        this.onOpacityUpdated( value );
    }

    protected abstract onOpacityUpdated( value: number ): void;

}