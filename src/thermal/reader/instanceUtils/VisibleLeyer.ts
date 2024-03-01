import { ThermalFileInstance } from "../ThermalFileInstance";
import { AbstractLayer } from "./AbstractLayer";
import ThermalDomFactory from "./domFactories";

export class VisibleLayer extends AbstractLayer {

    protected container: HTMLDivElement;
    protected image: HTMLImageElement;

    public get url() {
        return this._url;
    }
    public set url( value: string ) {
        this._url = value;
        this.image.src = value;
    }

    public constructor(
        instance: ThermalFileInstance,
        public _url: string
    ) {
        super( instance );
        this.container = ThermalDomFactory.createVisibleLayer();
        this.image = ThermalDomFactory.createVisibleImage();
        this.url = this._url;
        this.container.appendChild( this.image );
    }

    public getLayerRoot(): HTMLElement {
        return this.container;
    }



}