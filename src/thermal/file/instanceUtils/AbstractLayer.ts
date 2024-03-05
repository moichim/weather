import { ThermalFileInstance } from "../ThermalFileInstance";

export abstract class AbstractLayer {

    public constructor(
        protected readonly instance: ThermalFileInstance
    ) {}

    public abstract getLayerRoot(): HTMLElement;

}