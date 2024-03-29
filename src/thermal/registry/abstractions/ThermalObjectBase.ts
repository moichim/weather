import { ThermalEventsFactory } from "../events";

/**
 * Core methods and properties that are shared across files, groups and the registry
 * @deprecated To be removed!
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
    protected abstract recalculateAllParameters(): void;

}