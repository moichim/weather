import { IRON, ThermalPalettes } from "@/thermal/components/instance/palettes";
import { ThermalFileSource } from "./ThermalFileSource";
import ThermalFile from "./thermalFile";

type ThermalMouseEvent = MouseEvent & {
    layerX: number,
    layerY: number
}

/** Stores data of a thermal file and handles the canvas drawing */
export class ThermalFileInstance extends ThermalFile {

    // The container is used to store cursor data as data- atributes
    public container: HTMLDivElement | null = null;
    public wrapper: HTMLDivElement | null = null;
    protected canvas: HTMLCanvasElement | null = null;
    protected context: CanvasRenderingContext2D | null = null;

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
        if (this.container) {
            this.container.dataset.x = value
                ? value?.toString()
                : ""
        }
    }
    public get cursorX() {
        return this._cursorX;
    }

    protected _cursorY: number | undefined = undefined;
    protected set cursorY(value: number | undefined) {
        this._cursorY = value;
        if (this.container) {
            this.container.dataset.y = value
                ? value?.toString()
                : ""
        }
    }
    public get cursorY() {
        return this._cursorY;
    }

    protected _cursorValue: number | undefined = undefined;
    protected set cursorValue(value: number | undefined) {
        this._cursorValue = value;
        if (this.container) {
            this.container.dataset.value = value
                ? value?.toString()
                : ""
        }
    }
    public get cursorValue() {
        return this._cursorValue;
    }

    protected _hover = false;
    public get hover() {
        return this._hover;
    }
    protected set hover( value: boolean ) {
        if ( this.container ) {
            this.container.dataset.hover = value ? "on" : "off";
        }
        this._hover = value;
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
        files: { [index:string]: ThermalFileInstance },
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
            `file_${groupId}_${Object.values( files ).length.toString()}`
        );

    }

    /** Bind the class to the canvas element. */
    public bind(
        container: HTMLDivElement
    ) {

        if (this.container) {
            console.info( "Instance", this.id, "already has a container!" );
            return;
        }

        this.container = container;

        const wrapper = this.container.getElementsByClassName( "thermalCanvasWrapper" )[0];
        console.log( wrapper );

        if ( !wrapper ) {
            return;
        }

        this.wrapper = wrapper as HTMLDivElement;

        if ( this.container.hasChildNodes() ) {
            // return;
        }

        this.container.setAttribute( "id", `thermal_image_${this.id}` );
        this.container.dataset.binded === "true";

        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.padding = "0px";
        canvas.style.margin = "0px";
        canvas.style.objectFit = "contain";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.objectPosition = "top left";
        canvas.style.cursor = "crosshair";

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.wrapper.appendChild(this.canvas);

    }

    protected getPalette(): string[] {
        return IRON;
    }

    public initialise() {

        if (this.container) {

            this.drawEverything();

            this.container.onmousemove = (event: MouseEvent) => {

                const client = this.width;
                const parent = this.container?.clientWidth;

                if (client && parent) {

                    const aspect = client / parent;

                    const e = event as ThermalMouseEvent;

                    const x = Math.round(e.layerX * aspect);
                    const y = Math.round(e.layerY * aspect);

                    const value = this.getValueAtCoordinate( x, y );


                    if (x !== this.cursorX)
                        this.cursorX = x;
                    if (y !== this.cursorY)
                        this.cursorY = y;

                    if (value !== this.cursorValue)
                        this.cursorValue = value;

                    if ( this.hover === false )
                        this.hover = true;

                }



            }

            this.container.onmouseleave = () => {
                this.cursorX = undefined;
                this.cursorY = undefined;
                this.cursorValue = undefined;
                if ( this.hover === true )
                    this.hover = false;
            }

        } else {
            console.info("canvas ještě není ready");
        }

    }

    protected getValueAtCoordinate(
        x: number|undefined,
        y: number|undefined
    ) {

        if ( x === undefined || y === undefined ) {
            return undefined;
        }

        const index = x + (y * this.width);
        const value = this.pixels[index];
        return value;

    }

    public setCursorFromOutside(
        x: number|undefined,
        y: number|undefined
    ) {

        if ( this.hover === true ) {
            return;
        }

        this.cursorX = x;
        this.cursorY = y;
        this.cursorValue = this.getValueAtCoordinate( x, y );

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