import { ThermalEvents, ThermalEventsFactory } from "../events";
import { ThermalRangeOrUndefined } from "../interfaces";

/**
 * Core methods and properties that are shared across files, groups and the registry
 */
export abstract class ThermalObjectBase extends EventTarget {

    /** Destroy inner content of the object. Do not propagate the destruction upwards. */
    public destroySelf(): void {
        this.onDestroySelf();
        this.dispatchEvent( ThermalEventsFactory.destroyed() );
    };

    protected abstract onDestroySelf(): void;

    // Activation
    private _active: boolean = false;
    public get active() { return this._active; }
    private set active( value: boolean ) { 
        if ( this._active !== value ) {

            value
                ? this.dispatchEvent( ThermalEventsFactory.activated() )
                : this.dispatchEvent( ThermalEventsFactory.deactivated() );

        }
        this._active = value;

    }
    public recieveActivationStatus( status: boolean ): void {
        this.active = status;
        this.onRecieveActivationStatus( status );
    }
    /** Actions performed when the activation status is set from the outside */
    protected abstract onRecieveActivationStatus( status: boolean ): void;

    public imposeActivationStatus( status: boolean ): void {
        this.active = status;
        this.onImposeActivationStatus( status );
    }
    /** Actions performed when the activation status is needs to be imposed up */
    protected abstract onImposeActivationStatus( status: boolean ): void;


    /** Refresh parameters calculated from children */
    public abstract recalculateParameters(): void;

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