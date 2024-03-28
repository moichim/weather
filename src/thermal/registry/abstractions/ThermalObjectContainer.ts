import { ThermalEventsFactory } from "../events";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { ThermalObjectBase } from "./ThermalObjectBase";

export enum ThermalContainerStates {
    EMPTY = 0,
    LOADING = 1,
    LOADED = 2,
    RUNNING = 3,
    ERROR = 4
}

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

    /** Loading state */

    protected _loadingState: ThermalContainerStates = ThermalContainerStates.EMPTY;
    public get loadingState() {
        return this._loadingState;
    }

    public setStateEmpty() {
        if ( this.loadingState !== ThermalContainerStates.EMPTY ) {
            this._loadingState = ThermalContainerStates.EMPTY;
            this.onSetStateEmpty();
            this.dispatchEvent( ThermalEventsFactory.containerLoadingStateChanged(this, ThermalContainerStates.EMPTY) );
        }
    }

    protected abstract onSetStateEmpty(): void;

    public setStateLoading() {
        if ( this._loadingState !== ThermalContainerStates.LOADING ) {
            this._loadingState = ThermalContainerStates.LOADING;
            this.onSetStateLoading();
            this.dispatchEvent( ThermalEventsFactory.containerLoadingStateChanged(this, ThermalContainerStates.LOADING) );
        }
    }
    protected abstract onSetStateLoading(): void;

    public setStateLoaded() {
        if ( this._loadingState !== ThermalContainerStates.LOADED ) {
            this._loadingState = ThermalContainerStates.LOADED;
            this.onSetStateLoaded();
            this.dispatchEvent( ThermalEventsFactory.containerLoadingStateChanged(this, ThermalContainerStates.LOADED) );
        }
    }

    protected abstract onSetStateLoaded(): void;

    /** Removes all children - should emit emptied event */
    protected abstract removeAllChildren(): void;

}