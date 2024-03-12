import { ThermalPalettes } from "./palettes";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalObjectBase } from "../registry/abstractions/ThermalObjectBase";
import { ThermalEvents, ThermalEventsFactory } from "../registry/events";
import { ThermalCursorPositionOrundefined, ThermalRangeDataType } from "../registry/interfaces";
import { ThermalFileSource } from "./ThermalFileSource";
import { VisibleLayer } from "./instanceUtils/VisibleLayer";
import ThermalDomFactory from "./instanceUtils/domFactories";
import { ThermalCanvasLayer } from "./instanceUtils/thermalCanvasLayer";
import ThermalCursorLayer from "./instanceUtils/thermalCursorLayer";
import { ThermalListenerLayer } from "./instanceUtils/thermalListenerLayer";

/**
 * Instance of a thermal file takes care of its display and user interactions
 * 
 * Creation:
 * - instances are created in `ThermalFileSource.createInstance()`
 * - once the instance is created, it is necessary to do the following:
 *   - bind the instance to an empty `HTMLDivElement`
 *   - initialise the instance once it is binded
 * 
 * Initialisation
 * - binds the instance's inner DOM to the container
 * - creates event listeners for user interactions
 * - performs the initial `draw()` of the `ThermalCanvasLayer`
 * 
 * Integration
 * - as part of a `ThermalGroup`, the `ThermalFileInstance` synchronises its properties with the group
 * 
 * Events:
 * - ThermalEvents.INSTANCE_BINDED
 * - ThermalEvents.INSTANCE_INITIALISED
 * - ThermalEvents.RANGE_UPDATED
 * - ThermalEvents.MINMAX_UPDATED
 * - ThermalEvents.OPACITY_UPDATED
 * - ThermalEvents.CURSOR_UPDATED
 */
export class ThermalFileInstance extends ThermalObjectBase {
    


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
        public readonly group: ThermalGroup
    ) {
        super();
        this.id = `instance_${this.group.id}_${this.source.url}`;
        this.horizontalLimit = (this.width / 4) * 3;
        this.verticalLimit = (this.height / 4) * 3;
    }


    protected onDestroySelf() {
        this.clearDom();
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
    protected listenerLayer: ThermalListenerLayer | null = null;

    protected palette = ThermalPalettes.IRON;




    /**
     * Dom bindings
     */

    protected _binded: boolean = false;
    public get binded() { return this._binded; }
    protected set binded(value: boolean) { this._binded = value; }

    public buildDom(
        container: HTMLDivElement
    ) {

        if ( this.root !== null || this.binded === true ) {
            console.info("The instance already has its DOM.");
            // this.clearDom();
            return;
        }

        this.root = container;

        // Create the visible layer if necessary
        if (this.visibleUrl) {
            this.visibleLayer = new VisibleLayer(this, this.visibleUrl);
        }

        // Create the canvas layer
        this.canvasLayer = new ThermalCanvasLayer(this);

        // Create the cursor layer
        this.cursorLayer = new ThermalCursorLayer(this);

        // Create the listener layer
        this.listenerLayer = new ThermalListenerLayer( this );





    }

    protected clearDom() {
        this.binded = false;
        if ( this.root )
            this.root.dataset.binded = "false";
        // this.root?.remove();
        this.visibleLayer?.destroy();
        this.canvasLayer?.destroy();
        this.cursorLayer?.destroy();
        this.listenerLayer?.destroy();
        this.visibleLayer = null;
        this.canvasLayer = null;
        this.cursorLayer = null;
        this.listenerLayer = null;

    }



    /**
     * Activation status
     */

    protected onActivateInternal() {

        if (this.root) {

            if (this.visibleLayer)
                this.visibleLayer.mount();
            if (this.canvasLayer)
                this.canvasLayer.mount();
            if (this.cursorLayer)
                this.cursorLayer.mount();
            if (this.listenerLayer)
                this.listenerLayer.mount();

            // Update the root element
            this.root.setAttribute("id", this.id);
            this.root.dataset.binded = "true";
            this.root.style.zIndex = "10";
        }

        // Mark this instance as binded
        this.binded = true;

        if (this.active && this.listenerLayer && this.root && this.cursorLayer) {

            this.draw();

            this.listenerLayer.getLayerRoot().onmousemove = (event: MouseEvent) => {

                // Show the cursor
                this.cursorLayer!.show = true;
        
                this._isHover = true;
        
                const client = this.width;
                const parent = this.root!.clientWidth;
        
                const aspect = client / parent;
        
                const x = Math.round(event.offsetX * aspect);
                const y = Math.round(event.offsetY * aspect);
        
                this.imposeCursorPosition({ x, y });
        
            };

            this.listenerLayer.getLayerRoot().onmouseleave = () => {

                this.cursorLayer!.show = false;
        
                this._isHover = false;
        
                this.imposeCursorPosition(undefined);
        
            };

            this.listenerLayer.getLayerRoot().onclick = () => {
                if ( this._emitsDetail ) 
                    this.dispatchEvent( ThermalEventsFactory.emitInstanceDetail( this ) );
            };

            

        }

    }

    protected onDeactivateInternal() {

        if ( this.visibleLayer ) {
            this.visibleLayer.unmount();
        }

    }

    protected onRecieveActivationStatus(status: boolean): void {
        if ( status ) this.onActivateInternal();
        else this.onDeactivateInternal();
    }

    protected onImposeActivationStatus(status: boolean): void {
        this.onRecieveActivationStatus( status );
        this.group.recalculateParameters();
    }

    public recalculateParameters(): void {}



    public emit = () => {
        this.dispatchEvent( ThermalEventsFactory.emitInstanceDetail( this ) );
    }


    /**
     * User interactions
     */
    protected _emitsDetail: boolean = true;
    public get emitsDetail() { return this._emitsDetail; }
    public set emitsDetail( value: boolean ) {
        this._emitsDetail = value;
        if ( this.listenerLayer ) {
            this.listenerLayer.getLayerRoot().style.cursor = value ? "pointer" : "normal";
        }
    }



    /**
     * Drawing
     */

    public draw() {
        if (this.active && this.canvasLayer) {
            this.canvasLayer.draw();
        }
    }


    







    // Properties interaction





    // Range

    public get range() { return this._range; }
    protected _range: ThermalRangeDataType = { from: this.min, to: this.max };
    protected set range(value: ThermalRangeDataType) {
        this._range = value;
        this.dispatchEvent(ThermalEventsFactory.rangeUpdated(value));
        this.onRangeUpdated(value);
    }
    public recieveRange(
        value: ThermalRangeDataType
    ) {
        this.range = value;
    }
    protected onRangeUpdated(value: ThermalRangeDataType) {
        this.draw();
    }






    // Cursor & Value

    protected _isHover: boolean = false;
    public get isHover() { return this._isHover }

    protected _cursorValue: number | undefined;
    public get cursorValue() { return this._cursorValue; }

    protected _cursorPosition: ThermalCursorPositionOrundefined;
    public get cursorPosition() { return this._cursorPosition; }
    protected set cursorPosition(value: ThermalCursorPositionOrundefined) {

        // Store it locally
        this._cursorPosition = value;

        // calculate and propagate the value
        if (this.cursorPosition !== undefined) {

            // Calculate the value
            this._cursorValue = this.getValueAtCoordinate(this.cursorPosition.x, this.cursorPosition.y);

            // Propagate the change to the DOM
            if (this.cursorLayer && this.cursorValue) {
                this.cursorLayer.show = true;
                this.cursorLayer.setCursor(this.cursorPosition.x, this.cursorPosition.y, this.cursorValue);
            }

        } else {

            this._cursorValue = undefined;
            if (this.cursorLayer) {
                this.cursorLayer.resetCursor();
                this.cursorLayer.show = false;
            }

        }

        this.dispatchEvent(ThermalEventsFactory.cursorUpdated(
            this.isHover,
            this.cursorPosition,
            this.cursorValue
        ));

    }

    public recieveCursorPosition(
        position: ThermalCursorPositionOrundefined,
    ) {

        this.cursorPosition = position;

    }

    public imposeCursorPosition(
        position: ThermalCursorPositionOrundefined
    ) {
        this.group.recieveCursorPosition(position);
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




    // opacity

    public recieveOpacity(value: number) {
        this.opacity = value;
    }

    protected onOpacityUpdated(value: number): void {
        if (this.visibleLayer && this.canvasLayer) {
            this.canvasLayer.opacity = value;
        }
    }

}