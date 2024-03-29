"use client";


import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalRegistry } from "./ThermalRegistry";
import { ThermalFileRequest, ThermalRequest } from "./ThermalRequest";
import { ThermalContainerStates } from "./abstractions/ThermalObjectContainer";
import { ThermalEventsFactory } from "./events";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalMinmaxType, ThermalRangeOrUndefined } from "./interfaces";
import { IThermalGroup } from "./interfaces/interfaces";
import { MinmaxGroupProperty } from "./properties/properties/MinmaxGroupProperty";

/**
 * Group of thermal images
 */
export class ThermalGroup implements IThermalGroup {


    public readonly hash = Math.random();



    public constructor(
        public readonly registry: ThermalRegistry,
        public readonly id: string
    ) {
    }


    public readonly minmax: MinmaxGroupProperty = new MinmaxGroupProperty( this, undefined );


    /**
     * Destruction
     */


    /** Remove all instances, reset the minmax */
    public destroySelfAndBelow() {

        console.log( "Grupa", this.id, "se ničí!", this.hash );

        this.forEveryInstance( instance => instance.destroySelfAndBelow() );

        this.minmax.reset();

    }


    public removeAllChildren() {
        for (let instance of this.getInstancesArray()) {
            instance.destroySelfAndBelow();
            delete this.instancesByUrl[instance.id];
        }
    }

    public reset() {

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
            // this.dispatchEvent(ThermalEventsFactory.instanceCreated(instance, this));
            return instance;
        } else {
            return this.instancesByUrl[source.url];
        }
    }

    public forEveryInstance( fn: ((instance: ThermalFileInstance) => any) ) {
        this.getInstancesArray().forEach( fn );
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
        this.forEveryInstance(instance => {
            instance.recieveCursorPosition(value);
        });
        // this.dispatchEvent(ThermalEventsFactory.cursorUpdated(this._isHover, this.cursorPosition, undefined));

    }


}