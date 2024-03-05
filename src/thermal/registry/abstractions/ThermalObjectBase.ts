import { ThermalRangeEventDetails, ThermalRangeOrUndefined } from "../interfaces";

/**
 * Core methods and properties that are shared across files, groups and the registry
 */
export abstract class ThermalObjectBase extends EventTarget {

    // Event types
    public static RANGE_EVENT = "rangeevent";    
    public static OPACITY_EVENT = "opacityevent";


    // Range


    protected _range: ThermalRangeOrUndefined;
    public get range() { return this._range; }
    protected set range( value:  ThermalRangeOrUndefined ) { 
        this._range = value;
    }

    protected dispatchRangeEvent(
        impose: boolean = false
    ): void {
        this.dispatchEvent( new CustomEvent<ThermalRangeEventDetails>( 
            ThermalObjectBase.RANGE_EVENT,
            {
                detail: {
                    range: this.range,
                    imposed: impose
                }
            } 
        ) );
    }
    

    // Opacity

    protected _opacity: number = 1;
    public get opacity() { return this._opacity }
    protected set opacity( value: number ) {
        this.opacity = value;
    }

    protected dispatchOpacityEvent() {
        this.dispatchEvent( new Event( 
            ThermalObjectBase.OPACITY_EVENT,
         ) )
    }

}