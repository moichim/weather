import { PALETTE } from "@/thermal/file/palettes";
import { ThermalFileInstance } from "../ThermalFileInstance";
import { AbstractLayer } from "./AbstractLayer";
import ThermalDomFactory from "./domFactories";

export class ThermalCanvasLayer extends AbstractLayer {

    protected container: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;

    protected get width() { return this.instance.width; }
    protected get height() { return this.instance.height; }
    protected get pixels() { return this.instance.pixels; }
    protected get from() { return this.instance.range.from; }
    protected get to() { return this.instance.range.to; }

    protected _opacity: number = 1;
    public get opacity() { return this._opacity; }
    public set opacity( value: number ) {
        this._opacity = Math.max( Math.min( value, 1 ), 0 );
        if ( this._opacity !== 1 )
            this.getLayerRoot().style.opacity = this._opacity.toString();
        else {
            this.getLayerRoot().style.removeProperty( "opacity" );
        }
    }

    public constructor(
        instance: ThermalFileInstance
    ){

        super( instance );

        this.container = ThermalDomFactory.createCanvasContainer();

        this.canvas = ThermalDomFactory.createCanvas();
        this.canvas.width = this.instance.width;
        this.canvas.height = this.instance.height;

        this.context = this.canvas.getContext("2d")!;

        this.container.appendChild( this.canvas );

    }

    public getLayerRoot(): HTMLElement {
        return this.container;
    }

    /** Returns an array of 255 RGB colors */
    protected getPalette(): string[] {
        return PALETTE;
    }

    public draw(): void {

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