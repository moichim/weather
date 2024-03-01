import { ThermalFileInstance } from "../ThermalFileInstance";

export abstract class AbstractLayer {

    public constructor(
        protected readonly instance: ThermalFileInstance
    ) {}

    public abstract getLayerRoot(): HTMLElement;

    protected _opacity: number = 1;
    public get opacityAspect() { return this._opacity; }
    public set opacityAspect( value: number ) {
        this._opacity = Math.max( Math.min( value, 1 ), 0 );
        this.getLayerRoot().style.opacity = this._opacity.toString();
    }

}