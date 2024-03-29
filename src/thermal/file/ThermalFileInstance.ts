import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalEventsFactory } from "../registry/events";
import { ThermalCursorPositionOrundefined } from "../registry/interfaces";
import { IThermalObjectBase } from "../registry/interfaces/interfaces";
import { ThermalFileSource } from "./ThermalFileSource";
import { VisibleLayer } from "./instanceUtils/VisibleLayer";
import { ThermalCanvasLayer } from "./instanceUtils/thermalCanvasLayer";
import ThermalCursorLayer from "./instanceUtils/thermalCursorLayer";
import { ThermalDateLayer } from "./instanceUtils/thermalDateLayer";
import { ThermalListenerLayer } from "./instanceUtils/thermalListenerLayer";

/**
 * @todo implement variants toggling
 * @todo implement activation properly!
 * @todo implement unmounting
 * @todo rename binding to mounting
 */
export class ThermalFileInstance extends EventTarget implements IThermalObjectBase {
    


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



    public destroySelfAndBelow() {
        this.unmount();
    };
    public removeAllChildren() {
        this.unmount();
    };
    public reset() {};


    protected onDestroySelf() {
        this.unmount();
    }




    // The root container
    public root: HTMLDivElement | null = null;

    // The canvas layer
    protected canvasLayer: ThermalCanvasLayer | null = null;

    // The visible layer
    protected visibleLayer: VisibleLayer | null = null;

    /// The cursor layer
    protected cursorLayer: ThermalCursorLayer | null = null;

    // The date popup layer
    protected datelayer: ThermalDateLayer | null = null;

    // The listener layer
    protected listenerLayer: ThermalListenerLayer | null = null;




    /**
     * Dom bindings
     */

    protected _mounted: boolean = false;
    public get mounted() { return this._mounted; }
    protected set mounted(value: boolean) { this._mounted = value; }

    /** @todo what if the instance remounts back to another element? The layers should be mounted as well! */
    public mount(
        container: HTMLDivElement
    ) {

        if ( this.root !== null || this.mounted === true ) {
            console.info("The instance already has its DOM.");
            /** @todo this used to be commented. Wny? It should be on! */
            this.unmount();
            return;
        }

        this.root = container;
        this.root.style.borderWidth = "2px";
        this.root.style.borderStyle = "solid";
        this.root.style.borderColor = "transparent";
        this.root.style.margin = "-1px";
        this.root.style.transition = "border-color .1s ease-in-out";

        // Create the visible layer if necessary
        if (this.visibleUrl) {
            this.visibleLayer = new VisibleLayer(this, this.visibleUrl);
        }

        // Create the canvas layer
        this.canvasLayer = new ThermalCanvasLayer(this);

        // Create the cursor layer
        this.cursorLayer = new ThermalCursorLayer(this);

        // 
        this.datelayer = new ThermalDateLayer( this );

        // Create the listener layer
        this.listenerLayer = new ThermalListenerLayer( this );


        this.root.dataset.mounted = "true";
        this.mounted = true;


    }

    protected unmount() {
        this.mounted = false;
        if ( this.root )
            this.root.dataset.mounted = "false";
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
     * @todo refactor this with variants!
     */

    public hydrate() {

        if (this.root) {

            if (this.visibleLayer)
                this.visibleLayer.mount();
            if (this.canvasLayer)
                this.canvasLayer.mount();
            if (this.cursorLayer)
                this.cursorLayer.mount();
            if (this.datelayer)
                this.datelayer.mount();
            if (this.listenerLayer)
                this.listenerLayer.mount();

            // Update the root element
            this.root.setAttribute("id", this.id);
            this.root.dataset.binded = "true";
            this.root.style.zIndex = "10";
        }

        // Mark this instance as binded
        this.mounted = true;

        if (this.listenerLayer && this.root && this.cursorLayer) {

            this.draw();

            this.listenerLayer.getLayerRoot().onmousemove = (event: MouseEvent) => {

                // Show the cursor
                this.cursorLayer!.show = true;
        
                this.isHover = true;
                this.group.registry.highlight.higlightTime( this.timestamp );
        
                const client = this.width;
                const parent = this.root!.clientWidth;
        
                const aspect = client / parent;
        
                const x = Math.round(event.offsetX * aspect);
                const y = Math.round(event.offsetY * aspect);
        
                this.imposeCursorPosition({ x, y });
        
            };

            this.listenerLayer.getLayerRoot().onmouseleave = () => {

                this.cursorLayer!.show = false;
        
                this.isHover = false;
                this.group.registry.highlight.clearHighlight();
        
                this.imposeCursorPosition(undefined);
        
            };

            this.listenerLayer.getLayerRoot().onclick = () => {
                if ( this._emitsDetail ) 
                    this.dispatchEvent( ThermalEventsFactory.emitInstanceDetail( this ) );
            };

            

        }

    }

    public dehydrate() {

        if ( this.visibleLayer ) {
            this.visibleLayer.unmount();
        }

    }



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
        if ( this.canvasLayer) {
            this.canvasLayer.draw();
        }
    }

    /** Recieve a palette setting */
    public recievePalette(
        palette: string | number
    ) {
        this.draw();
    }






    // Cursor & Value

    protected _isHover: boolean = false;
    public get isHover() { return this._isHover }
    protected set isHover( value: boolean ) {
        this._isHover = value;

        if ( value ) {
            //this.datelayer?.show()
            if ( this.root )
                this.root.style.borderColor = "black";
        } else {
            this.datelayer?.hide();
            if ( this.root )
                this.root.style.borderColor = "transparent";
        }
    }

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
            this._cursorValue = this._getValueAtCoordinate(this.cursorPosition.x, this.cursorPosition.y);

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


    protected _getValueAtCoordinate(
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

    /** 
     * Recieve the opacity and project it directly to the appropriate layer.
     */
    public recieveOpacity(value: number) {


        if (this.visibleLayer && this.canvasLayer) {
            this.canvasLayer.opacity = value;
        }
    }


    // hightlighting
    public setHighlight( value: boolean ) {

        if ( value ) {
            if (this.root )
                this.root.style.borderColor = "black";
            this.datelayer?.show()
        } else {
            if ( this.root )
                this.root.style.borderColor = "transparent";
            this.datelayer?.hide()
        }

    }

}