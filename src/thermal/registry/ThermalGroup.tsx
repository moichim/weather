"use client";


import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalRegistry } from "./ThermalRegistry";
import { ThermalFileRequest, ThermalRequest } from "./ThermalRequest";
import { ThermalContainerStates, ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalEventsFactory } from "./events";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalMinmaxType, ThermalRangeOrUndefined } from "./interfaces";

/**
 * Group of thermal images
 * 
 * Creation:
 * - created by `ThermalRegistry`
 * 
 * Integration
 * - recieves the range from the registry and passes it down to instances
 * - sends its minmax to the registry
 * - recieves the cursor position from hovered instances and synchronise the value to all instances
 * - recieves the opacity from the registry and passes it down to instances
 * 
 * Events:
 * - ThermalEvents.INSTANCE_CREATED
 * - ThermalEvents.RANGE_UPDATED
 * - ThermalEvents.MINMAX_UPDATED
 * - ThermalEvents.OPACITY_UPDATED
 * - ThermalEvents.CURSOR_UPDATED
 * - ThermalEvents.GROUP_LOADING_START
 * - ThermalEvents.GROUP_LOADING_FINISH
 */
export class ThermalGroup extends ThermalObjectContainer {


    public readonly hash = Math.random();



    public constructor(
        public readonly registry: ThermalRegistry,
        public readonly id: string
    ) {
        super();
    }







    /** Loading states */


    protected onSetStateEmpty(): void {

        // delete all instances
        this.removeAllChildren();

        // reset the minmax
        this.minmax = undefined;

        // reset the range
        this.range = undefined;
    }


    protected onSetStateLoading(): void {
        this.registry.groupStartedLoading(this.id);
    }

    protected onSetStateLoaded(): void {
        // After all instances are loaded, recalculate the parameters
        this.recalculateAllParameters();
        // Indicate the loading state above
        this.registry.groupFinisledLoading(this.id);
    }


    /** Loading itself */



    /** Buffer of all pending requests */
    protected _requests: ThermalRequest[] = []
    public get requests() { return this._requests; }

    /** Request a single file. To fetch it, call ``resolveQuery` */
    public requestFile(
        thermalUrl: string,
        visibleUrl?: string
    ) {

        // Can request files only when the group is not loading
        if (this.loadingState === ThermalContainerStates.LOADING) {
            console.error(`The group ${this.id} is already loading! Can not request  a single file!`);
            return;
        }

        // Add a single request
        this._requests.push(ThermalRequest.single(this, thermalUrl, visibleUrl));

    }

    /** Request multiple files. To fetch them, call ``resolveQuery` */
    public requestFiles(requests: ThermalFileRequest[]) {

        // Can request files only when the group is not loading
        if (this.loadingState === ThermalContainerStates.LOADING) {
            console.error(`The group ${this.id} is already loading! Can not request multiple files!`);
            return;
        }

        // Add multiple requests
        this._requests = ThermalRequest.multiple(this, requests);

    }
    public async resolveQuery() {

        // If the group is already loading, do nothing
        if (this.loadingState === ThermalContainerStates.LOADING) {
            console.error(`The group ${this.id} is already loading! Can not resolve the query!`);
            // return this;
        }
        // If the group is not loading yet, fire the requests
        else {

            if (this._requests.length === 0) {
                console.error(`The group ${this.id} has no queried files!`);
            }

            this.setStateLoading();

            // Perform the fetches
            const result = await Promise.all(
                this._requests.map(request => request.fetch())
            );

            // Process the requests
            for (let file of result) {

                if (file !== null) {

                    // This makes sure that there are no duplicite sources
                    file = this.registry.registerSource(file);

                    // Add the request in the group in a unified way
                    this.instantiateSource(file);

                }

            }

            // Mark the state as loaded to perform all the postprocessing
            this.setStateLoaded();

            return this;

        }

    }






    /**
     * Destruction
     */


    protected onDestroySelf() {

        console.log( "Grupa", this.id, "se ničí!", this.hash );

        this.getInstancesArray().forEach(instance => instance.destroySelf());

        this.minmax = undefined;
        this.range = undefined;

    }


    public removeInstance(
        url: string
    ): void {

        const instance = this.instancesByUrl[url];
        instance.destroySelf();
        delete this.instancesByUrl[url];
        this.recalculateAllParameters();

    }


    protected removeAllChildren() {
        for (let instance of this.getInstancesArray()) {
            instance.destroySelf();
            delete this.instancesByUrl[instance.id];
        }
    }




    /**
     * Instances
     */



    protected _instancesByUrl: {
        [index: string]: ThermalFileInstance
    } = {}
    public get instancesByUrl() { return this._instancesByUrl }
    public getInstancesArray() {
        return Object.values(this._instancesByUrl);
    }
    protected getInstancesUrls() {
        return Object.keys(this._instancesByUrl);
    }
    public instantiateSource(
        source: ThermalFileSource
    ) {
        if (!this.getInstancesUrls().includes(source.url)) {
            const instance = source.createInstance(this);
            this._instancesByUrl[source.url] = instance;
            this.dispatchEvent(ThermalEventsFactory.instanceCreated(instance, this));
            return instance;
        } else {
            return this.instancesByUrl[source.url];
        }
    }






    /**
     * Recalculation of parameters
     */
    public recalculateAllParameters(): void {
        this.minmax = this._getMinmaxFromInstances();
    }


    protected _getMinmaxFromInstances(): ThermalMinmaxOrUndefined {

        const instances = this.getInstancesArray();

        if (instances.length === 0)
            return undefined;
        return instances.reduce((state, current) => {

            if (current.min < state.min || current.max > state.max) {
                return {
                    min: current.min < state.min ? current.min : state.min,
                    max: current.max > state.max ? current.max : state.max
                }
            }

            return state;

        }, { min: Infinity, max: -Infinity } as ThermalMinmaxType);
    }







    /**
     * Activation
     */

    protected onRecieveActivationStatus(status: boolean): void {

        this.getInstancesArray().forEach(instance => instance.recieveActivationStatus(status));

    }


    protected onImposeActivationStatus(status: boolean): void {

        this.onRecieveActivationStatus(status);

        this.registry.recalculateAllParameters();

    }






    









    /**
     * Range
     */


    public recieveRange(value: ThermalRangeOrUndefined) {

        // Store locally
        this.range = value;

    }

    protected onRangeUpdated(value: ThermalRangeOrUndefined) {

        // Project in all instances
        if (value !== undefined) {
            this.getInstancesArray().forEach(instance => {
                instance.recieveRange(value);
            });
        }

    }

    protected _isHover: boolean = false;
    public get isHover() { return this._isHover }

    protected _cursorPosition: ThermalCursorPositionOrundefined;
    public get cursorPosition() { return this._cursorPosition }

    public recieveCursorPosition(
        value: ThermalCursorPositionOrundefined
    ) {
        this._cursorPosition = value;
        this._isHover = value !== undefined;
        this.getInstancesArray().forEach(instance => {
            instance.recieveCursorPosition(value);
        });
        this.dispatchEvent(ThermalEventsFactory.cursorUpdated(this._isHover, this.cursorPosition, undefined));

    }






    /**
     * Opacity
     */

    public recieveOpacity(value: number) {
        this.opacity = value;
    }

    protected onOpacityUpdated(value: number): void {
        this.getInstancesArray().forEach(instance => instance.recieveOpacity(value));
    }

}