import { ThermalFileInstance } from "../ThermalFileInstance";

export abstract class AbstractLayer {

    public constructor(
        protected readonly instance: ThermalFileInstance
    ) {}

    public abstract getLayerRoot(): HTMLElement;

    protected mounted = false;

    public mount() {
        if ( !this.mounted )
        if ( this.instance.root !== null ) {
            this.mounted = true;
            this.instance.root.appendChild( this.getLayerRoot() );
        }
    }

    public unmount() {
        if ( this.mounted )
        if ( this.instance.root !== null ) {
            this.mounted = false;
            this.instance.root.removeChild( this.getLayerRoot() );
        }
    }

    public destroy(): void {
        this.onDestroy();
    }

    protected abstract onDestroy(): void;

}