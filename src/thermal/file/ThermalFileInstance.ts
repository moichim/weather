import { ThermalPalettes } from "../components/instance/palettes";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalObjectBase } from "../registry/abstractions/ThermalObjectBase";
import { ThermalCursorInstanceEventDetail, ThermalCursorPositionOrundefined, ThermalRangeDataType } from "../registry/interfaces";
import { ThermalFileSource } from "./ThermalFileSource";
import { VisibleLayer } from "./instanceUtils/VisibleLayer";
import ThermalDomFactory from "./instanceUtils/domFactories";
import { ThermalCanvasLayer } from "./instanceUtils/thermalCanvasLayer";
import ThermalCursorLayer from "./instanceUtils/thermalCursorLayer";

export class ThermalFileInstance extends ThermalObjectBase {


    public static BINDED = "binded";
    public static INITIALISED = "initialised";


    // Core properties are mirrored from the source

    public get url() { return this.source.url };
    public get signature() { return this.source.signature }
    public get unit() { return this.source.unit };
    public get width() { return this.source.width; }
    public get height() { return this.source.height; }
    public get timestamp() { return this.source.timestamp; }
    public get pixels() { return this.source.pixels; }
    public get min() { return this.source.min; }
    public get max() { return this.source.max; }
    public get visibleUrl() { return this.source.visibleUrl; }

    // Necessary properties are calculated in the constructor

    public readonly id: string;
    protected readonly horizontalLimit: number;
    protected readonly verticalLimit: number;

    public constructor(
        protected readonly source: ThermalFileSource,
        protected readonly group: ThermalGroup
    ) {
        super();
        this.id = `instance_${this.group.id}_${this.source.url}`;
        this.horizontalLimit = ( this.width / 4 ) * 3;
        this.verticalLimit = ( this.height / 4 ) * 3;
    }

    // The root container
    public root: HTMLDivElement | null = null;

    // The canvas layer
    protected canvasLayer: ThermalCanvasLayer | null = null;

    // The visible layer
    protected visibleLayer: VisibleLayer | null = null;

    /// The cursor layer
    protected cursorLayer: ThermalCursorLayer | null = null;

    // The listener layer
    protected listenerLayer: HTMLDivElement | null = null;

    protected palette = ThermalPalettes.IRON;




    // DOM bindings

    protected _binded: boolean = false;
    public get binded() { return this._binded; }
    protected set binded( value: boolean ) { this._binded = value; }

    public bind(
        container: HTMLDivElement
    ) {

        if ( this.root ) {
            console.info( "The instance already exists. Removing the old and proceeding creating the new." );
            this.unbind();
        }

        this.root = container;

        // Create the visible layer if necessary
        if ( this.visibleUrl ) {
            this.visibleLayer = new VisibleLayer( this, this.url );
        }

        // Create the canvas layer
        this.canvasLayer = new ThermalCanvasLayer( this );

        // Create the cursor layer
        this.cursorLayer = new ThermalCursorLayer( this );

        // Create the listener layer
        this.listenerLayer = ThermalDomFactory.createListener();


        // Bind it all together
        if ( this.visibleLayer )
            this.root.appendChild( this.visibleLayer.getLayerRoot() );
        this.root.appendChild( this.canvasLayer.getLayerRoot() );
        this.root.appendChild( this.cursorLayer.getLayerRoot() );
        this.root.appendChild( this.listenerLayer );

        // Update the root element
        this.root.setAttribute( "id", this.id );
        this.root.dataset.binded = "true";
        this.root.style.zIndex = "100";

        // Mark this instance as binded
        this.binded = true;

        // Dispatch the event
        this.dispatchEvent( new Event( ThermalFileInstance.BINDED ) );


    }

    protected unbind() {
        this.root?.remove();
        this.visibleLayer = null;
        this.canvasLayer = null;
        this.cursorLayer = null;
        this.listenerLayer = null;
    }

    public initialise() {

        if ( this.binded && this.listenerLayer && this.root && this.cursorLayer ) {

            this.draw();

            this.listenerLayer.onmousemove = ( event: MouseEvent ) => {

                // Show the cursor
                this.cursorLayer!.show = true;
                

                const client = this.width;
                const parent = this.root!.clientWidth;

                const aspect = client / parent;

                const x = Math.round( event.offsetX * aspect );
                const y = Math.round( event.offsetY * aspect );

                this.group.recieveCursorPosition( { x, y } );


            }

            this.listenerLayer.onmouseleave = () => {

                this.cursorLayer!.show = false;

                this.group.recieveCursorPosition( undefined );

            }

            this.dispatchEvent( new Event( ThermalFileInstance.INITIALISED ) );

        }

    }

    public draw() {
        if ( this.binded && this.canvasLayer ) {
            this.canvasLayer.draw();
        }
    }








    // Properties interaction





    // Range

    public get range() { return this._range; }
    protected _range: ThermalRangeDataType = { from: this.min, to: this.max };
    protected recieveRange(
        value: ThermalRangeDataType
    ) {
        this._range = value;
        //... draw !!!
        this.dispatchRangeEvent( false );
    }






    // Cursor & Value

    protected _isHover: boolean = false;
    public get isHover() { return this._isHover }
    
    protected _cursorPosition: ThermalCursorPositionOrundefined;
    public get cursorPosition() { return this._cursorPosition; }

    protected _cursorValue: number|undefined;
    public get cursorValue() { return this._cursorValue; }

    public recieveCursorPosition(
        position: ThermalCursorPositionOrundefined,
    ) {
        
        // Process the event
        this.processCursorMovedEvent( position );

        // Dispatch the change event
        this.dispatchCursorEvent( position, this.isHover );

    }


    protected processCursorMovedEvent(
        value: ThermalCursorPositionOrundefined,
    ) {
        // Store the values locally
        this._cursorPosition = value;
        this._isHover = value !== undefined;
        if ( this.cursorPosition !== undefined ) {

            this._cursorValue = this.getValueAtCoordinate( this.cursorPosition.x, this.cursorPosition.y );

        } else {
            this._cursorValue = undefined;
        }

        // Propagate the values in the cursor layer
        if ( this.cursorLayer ) {

            if ( this.cursorPosition && this.cursorValue !== undefined ) {
                this.cursorLayer.setCursor( this.cursorPosition?.x, this.cursorPosition.y, this.cursorValue );
            } else {
                this.cursorLayer.resetCursor();
            }

        }

    }

    protected getValueAtCoordinate(
        x: number | undefined,
        y: number | undefined
    ) {

        if (x === undefined || y === undefined) {
            return undefined;
        }

        const index = x + (y * this.width);
        const value = this.pixels[index];
        return value;

    }


    protected dispatchCursorEvent(
        value: ThermalCursorPositionOrundefined,
        impose: boolean = false,
    ) {
        this.dispatchEvent( new CustomEvent<ThermalCursorInstanceEventDetail>(
            ThermalGroup.CURSOR_EVENT,
            {
                detail: {
                    position: value,
                    imposed: impose,
                    isHover: value !== undefined,
                    value: this.cursorValue
                }
            }
        ) );
    }




    // opacity

    public recieveOpacity( value: number ) {
        if ( this.visibleLayer && this.binded && this.canvasLayer ) {
            this.canvasLayer.opacity = value;
            this.dispatchOpacityEvent();
        }
    }

}