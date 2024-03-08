
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalRegistry } from "./ThermalRegistry";
import { ThermalFileRequest, ThermalRequest } from "./ThermalRequest";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalEventsFactory } from "./events";
import { ThermalCursorPositionOrundefined, ThermalMinmaxType, ThermalRangeOrUndefined } from "./interfaces";

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

    // Requesting
    protected _loading: ThermalRequest[] = []

    protected _isLoading: boolean = false;
    public get isLoading() { return this._isLoading; }
    protected set isLoading(value: boolean) {

        if (value !== this._isLoading) {
            this._isLoading = value;
            
            value
                ? this.dispatchEvent(ThermalEventsFactory.groupLoadingStart(this))
                : this.dispatchEvent( ThermalEventsFactory.groupLoadingEnd( this ) );
        }

    }

    public requestFile(
        thermalUrl: string,
        visibleUrl?: string
    ) {

        if (this.isLoading === false)
            this.isLoading = true;

        this._loading.push(ThermalRequest.single(this, thermalUrl, visibleUrl));

    }
    public requestFiles(requests: ThermalFileRequest[]) {

        if (this.isLoading === false)
            this.isLoading = true;

        this._loading = ThermalRequest.multiple(this, requests);

    }
    public async resolveQuery() {

        // Perform the fetches
        const result = await Promise.all(
            this._loading.map(request => request.fetch())
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

        // Calculate the minmax

        this.minmax = this.calculateMinMax();

        this.registry.recalculateMinmax();

        // Dispatch the event on the end
        this.isLoading = false;

    }

    protected calculateMinMax() {

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

    protected clampRangeWithinMinmax(): ThermalRangeOrUndefined {

        // If there is no minmax, return undefined
        if (this.minmax === undefined) {

            return undefined;

        }

        // If there is a minmax but no range, create the range from minmax
        else if (this.minmax !== undefined && this.range === undefined) {
            return {
                from: this.minmax.min,
                to: this.minmax.max
            }
        }

        // Otherwise make sure the range fits withnin the minmax

        return this.range;

    }




    protected instancesByUrl: {
        [index: string]: ThermalFileInstance
    } = {}
    public getInstancesArray() {
        return Object.values(this.instancesByUrl);
    }
    protected getInstancesUrls() {
        return Object.keys(this.instancesByUrl);
    }
    public instantiateSource(
        source: ThermalFileSource
    ) {
        if (!this.getInstancesUrls().includes(source.url)) {
            const instance = source.createInstance(this);
            this.instancesByUrl[source.url] = instance;
            this.dispatchEvent( ThermalEventsFactory.instanceCreated( instance, this ) );
        }
    }



    public constructor(
        public readonly registry: ThermalRegistry,
        public readonly id: string
    ) {
        super();
    }


    public recieveRange(value: ThermalRangeOrUndefined) {

        // Store locally
        this.range = value;

    }

    protected onRangeUpdated( value: ThermalRangeOrUndefined ) {

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
        this.dispatchEvent( ThermalEventsFactory.cursorUpdated( this._isHover, this.cursorPosition, undefined ) );

    }



    // Opacity
    public recieveOpacity(value: number) {
        this.opacity = value;
    }

    protected onOpacityUpdated(value: number): void {
        this.getInstancesArray().forEach( instance => instance.recieveOpacity( value ) );
    }

}