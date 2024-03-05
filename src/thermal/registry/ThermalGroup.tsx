
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalRegistry } from "./ThermalRegistry";
import { ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalCursorGroupEventDetail, ThermalCursorPositionOrundefined, ThermalInstanceAddedEventDetail, ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "./interfaces";

export class ThermalGroup extends ThermalObjectContainer {

    public static INSTANCE_ADDED_EVENT = "instanceadded";
    public static CURSOR_EVENT = "cursorevent";

    protected instancesByUrl: {
        [index: string]: ThermalFileInstance
    } = {}
    public getInstancesArray() {
        return Object.values( this.instancesByUrl );
    }
    protected getInstancesUrls() {
        return Object.keys( this.instancesByUrl );
    }
    public recieveInstance(
        instance: ThermalFileInstance
    ) {
        if ( ! this.getInstancesUrls().includes( instance.url ) ) {
            this.instancesByUrl[ instance.url ] = instance;
            this.dispatchInstanceCreatedEvent( instance );
        }
    }

    protected dispatchInstanceCreatedEvent(
        instance: ThermalFileInstance
    ) {
        this.dispatchEvent( new CustomEvent<ThermalInstanceAddedEventDetail>(
            ThermalGroup.INSTANCE_ADDED_EVENT,
            {
                detail: {
                    instance: instance
                }
            }
        ) );
    }


    public constructor(
        public readonly registry: ThermalRegistry,
        public readonly id: string
    ) {
        super();
    }


    public recieveRange( value: ThermalRangeOrUndefined ) {

        // Store locally
        this.range = value;
        const imposedValue = value
            ? {from: value.from, to: value.to}
            : { from: undefined, to: undefined }
        
        // Project in all instances
        this.getInstancesArray().forEach( instance => {

            //instance.setRangeFromTheOutside( imposedValue.from, imposedValue.to );

        } );

        // Dispatch event
        this.dispatchRangeEvent( false );

    }

    public recieveMinmax( value: ThermalMinmaxOrUndefined ) {
        
        // Store locally
        this.minmax = value;
        
        // Dispatch event
        this.dispatchMinmaxEvent( false );

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
        this.getInstancesArray().forEach( instance => {
            instance.recieveCursorPosition( value );
        } );
        this.dispatchCursorEvent( value, false );

    }

    protected dispatchCursorEvent(
        value: ThermalCursorPositionOrundefined,
        impose: boolean = false,
    ) {
        this.dispatchEvent( new CustomEvent<ThermalCursorGroupEventDetail>(
            ThermalGroup.CURSOR_EVENT,
            {
                detail: {
                    position: value,
                    imposed: impose,
                    isHover: value !== undefined
                }
            }
        ) );
    }



    // Opacity
    public recieveOpacity( value: number ) {

        this.opacity = value;

        this.getInstancesArray().forEach( instance => instance.recieveOpacity( value ) );

        this.dispatchOpacityEvent();

    }

}