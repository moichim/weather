import { ThermalLoader } from "../parsers/thermalLoader";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalFileInstance } from "./ThermalFileInstance";

export class ThermalFileSource extends EventTarget {

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
        public readonly visibleUrl?: string
    ) {
        super();
    }

    public getMinMax() {
        return {
            min: this.min,
            max: this.max
        }
    }

    public static async fromUrl(
        thermalUrl: string,
        visibleUrl?: string
    ) {
        const file = await ThermalLoader.fromUrl( thermalUrl, visibleUrl );

        if ( ! file )
            return null;

            return file;
    }

    public createInstance(
        group: ThermalGroup
    ) {
        return new ThermalFileInstance( this, group );
    }

}