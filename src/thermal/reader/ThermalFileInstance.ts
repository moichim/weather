import { IRON, PALETTE, ThermalPalettes } from "@/thermal/components/instance/palettes";
import { ThermalFileSource } from "./ThermalFileSource";
import ThermalFile from "./thermalFile";
import EventEmitter from "events";
import ThermalDomFactory from "./instanceUtils/domFactories";
import ThermalCursorLayer from "./instanceUtils/thermalCursorLayer";

type ThermalMouseEvent = MouseEvent & {
    layerX: number,
    layerY: number
}

export interface UserInteractionEvent extends Event {
    target: ThermalFileInstance,
    data?: any
}
  

/** Stores data of a thermal file and handles the canvas drawing */
export class ThermalFileInstance extends ThermalFile {

    // The container is used to store cursor data as data- atributes
    public root: HTMLDivElement | null = null;

    // The canvas itself should be inside a wrapper
    public canvasContainer: HTMLDivElement | null = null;

    // The canvas element must be in the lowest layer
    protected canvas: HTMLCanvasElement | null = null;
    protected context: CanvasRenderingContext2D | null = null;

    /// The cursor layer
    protected cursorLayer: ThermalCursorLayer | null = null;

    protected palette = ThermalPalettes.IRON;


    // FROM

    protected _from: number = this.min;
    public set from(value: number) {
        this._from = this.sanitizeMinBeforeSetting(value);
        this.update();
    };
    public get from() {
        return this._from;
    }

    // TO

    protected _to: number = this.max;
    public set to(value: number) {
        this._to = this.sanitizeMaxBeforeSetting(value);
        this.update();
    }
    public get to() {
        return this._to;
    }

    // RANGE = set MIN and MAX at once

    public get range() {
        return [this.from, this.to];
    }
    public set range(value: [number, number]) {
        this._from = this.sanitizeMinBeforeSetting(value[0]);
        this._to = this.sanitizeMaxBeforeSetting(value[1]);
        this.update();
    }


    // Utilities for from / to setting

    protected sanitizeMinBeforeSetting(value: number) {
        if (value > this.max) {
            return this.max;
        }
        return value;
    }

    protected sanitizeMaxBeforeSetting(value: number) {
        if (value < this.min) {
            return this.min;
        }
        return value;
    }


    // CURSOR
    protected _cursorX: number | undefined = undefined;
    protected set cursorX(value: number | undefined) {
        this._cursorX = value;
        //this.interact();
    }
    public get cursorX() {
        return this._cursorX;
    }

    protected _cursorY: number | undefined = undefined;
    protected set cursorY(value: number | undefined) {
        this._cursorY = value;
        //this.interact();
    }
    public get cursorY() {
        return this._cursorY;
    }

    protected _cursorValue: number | undefined = undefined;
    protected set cursorValue(value: number | undefined) {
        this._cursorValue = value;
        // this.interact();
    }
    public get cursorValue() {
        return this._cursorValue;
    }

    protected _hover = false;
    public get hover() {
        return this._hover;
    }
    protected set hover(value: boolean) {
        // this.interact();
        this._hover = value;
        if ( this.cursorLayer ) {
            this.cursorLayer.hover = this._hover;
        }
    }




    public readonly id: string;

    public constructor(
        public readonly url: string,
        public readonly signature: string,
        public readonly unit: number,
        public readonly width: number,
        public readonly height: number,
        public readonly timestamp: number,
        public readonly pixels: number[],
        public readonly min: number,
        public readonly max: number,
        public readonly groupId: string,
        public readonly fileId: string
    ) {

        super(
            url,
            signature,
            unit,
            width,
            height,
            timestamp,
            [...pixels],
            min,
            max
        );

        this.id = `instance_${this.groupId}_${this.fileId}`

    }

    public static fromSource(
        groupId: string,
        frameId: string,
        source: ThermalFileSource
    ) {
        return new ThermalFileInstance(
            source.url,
            source.signature,
            source.unit,
            source.width,
            source.height,
            source.timestamp,
            source.pixels,
            source.min,
            source.max,
            groupId,
            frameId
        );
    }

    public static fromSourceWithIndexedName(
        groupId: string,
        files: { [index: string]: ThermalFileInstance },
        source: ThermalFileSource
    ) {

        return new ThermalFileInstance(
            source.url,
            source.signature,
            source.unit,
            source.width,
            source.height,
            source.timestamp,
            source.pixels,
            source.min,
            source.max,
            groupId,
            `file_${groupId}_${Object.values(files).length.toString()}`
        );

    }

    /** Bind the class to the canvas element. */
    public bind(
        container: HTMLDivElement
    ) {

        if (this.root) {
            console.info("Instance", this.id, "already has a container!");
            return;
        }

        this.root = container;

        // Update the root element
        this.root.setAttribute("id", `thermal_image_${this.id}`);
        this.root.dataset.binded === "true";
        this.root.style.zIndex = "100";


        // Create the container for the canvas
        this.canvasContainer = document.createElement( "div" );
        this.canvasContainer.classList.add( "thermalCanvasWeapper" );


        // Create the canvas
        this.canvas = ThermalDomFactory.createCanvas();
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Extract the drawing context
        this.context = this.canvas.getContext("2d");


        // Create the canvas layer instance
        this.cursorLayer = new ThermalCursorLayer( this );


        // Bind it all together

        // 1. append the canvas container
        this.root.appendChild( this.canvasContainer );

        // 2. push the canvas inside the container
        this.canvasContainer.appendChild(this.canvas);

        // 3. bind the cursor layer root element
        this.root.appendChild( this.cursorLayer.getLayerRoot() );

    }

    protected getPalette(): string[] {
        return PALETTE;
    }

    public initialise() {

        if (this.root) {

            this.drawEverything();

            this.root.onmousemove = (event: MouseEvent) => {

                const client = this.width;
                const parent = this.root?.clientWidth;

                if ( this.cursorLayer ) {
                    this.cursorLayer.show = true;
                }

                if (client && parent) {

                    const aspect = client / parent;

                    const x = Math.round(event.offsetX * aspect);
                    const y = Math.round(event.offsetY * aspect);

                    /** @todo A bit hacky prevention of strange behavious */
                    if ( x === 0 || y === 0 )
                        return ;

                    let doSet = true;

                    if ( x < 10 || y < 10 ) {

                        if ( this.cursorX !== undefined && this.cursorY !== undefined ) {
                            if (
                                Math.abs( x - this.cursorX ) < 3
                                || Math.abs( y - this.cursorY ) < 3
                            ) {
                                this.setCursorFromTheInside(x, y);
                            }
                        } else {
                            this.setCursorFromTheInside(x, y);
                        }

                        return;
                    }

                    /** @todo Here ends the hack */

                    if ( doSet ) {
                        this.setCursorFromTheInside(x, y);

                    }

                    return;

                    

                }



            }

            this.root.onmouseleave = () => {

                this.cursorX = undefined;
                this.cursorY = undefined;
                this.cursorValue = undefined;
                this.hover = false;
                if ( this.cursorLayer ) {
                    this.cursorLayer.show = false;
                }
                this.emitInnerChange();
            }

        } else {
            console.info("canvas ještě není ready");
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

    protected setCursorFromTheInside(
        x: number | undefined,
        y: number | undefined
    ) {
        if (x !== undefined && y !== undefined) {
            this.hover = true;
            this.cursorX = x;
            this.cursorY = y;
            this.cursorValue = this.getValueAtCoordinate(x, y);
            if ( this.cursorLayer && this.cursorValue ) {
                this.cursorLayer?.setCursor( this.cursorX, this.cursorY, this.cursorValue );
            }
            
        } else {
            this.hover = false;
            this.cursorX = undefined;
            this.cursorY = undefined;
            this.cursorValue = undefined;
            this.cursorLayer?.resetCursor();
        }

        this.emitInnerChange();

    }

    public setCursorFromOutside(
        x: number | undefined,
        y: number | undefined
    ) {

        if (this.hover === true) {
            return;
        }

        this.cursorX = x;
        this.cursorY = y;
        this.cursorValue = this.getValueAtCoordinate(x, y);

        if ( this.cursorLayer ) {
            if ( this.cursorX !== undefined && this.cursorY && this.cursorValue ) {
                this.cursorLayer.setCursor( this.cursorX, this.cursorY, this.cursorValue );
                this.cursorLayer.show = true;
            } else {
                this.cursorLayer.show = false;
            }
        }
        

        this.emitOuterChange();

    }

    public setRangeFromTheOutside(
        from: number | undefined,
        to: number | undefined
    ) {

        if ( from === undefined || to === undefined ) {
            this.range = [ this.min, this.max ];
        } else {
            this.range = [ from, to ];
        }

    }

    protected emitInnerChange = () => {
        this.dispatchEvent(new Event("userinteraction"));
    }

    protected emitOuterChange = () => {
        this.dispatchEvent(new Event("godinteraction"));
    }

    public update() {

        if (this.canvas) {

            this.drawEverything();

        }

    }

    protected drawEverything() {

        if (this.context !== null) {

            // Get the displayed range
            const displayRange = this.to - this.from;

            for (let x = 0; x <= this.width; x++) {

                for (let y = 0; y <= this.height; y++) {

                    const index = x + (y * this.width);

                    // Clamp temperature to the displayedRange
                    let temperature = this.pixels[index];
                    if (temperature < this.from)
                        temperature = this.from;
                    if (temperature > this.to)
                        temperature = this.to;

                    const temperatureRelative = temperature - this.from;
                    const temperatureAspect = temperatureRelative / displayRange;
                    const colorIndex = Math.round(255 * temperatureAspect);

                    const color = this.getPalette()[colorIndex];
                    this.context.fillStyle = color;
                    this.context.fillRect(x, y, 1, 1);

                }

            }

        }


    }


}