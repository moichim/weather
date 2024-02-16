import { IRON, ThermalPalettes } from "@/thermal/components/instance/palettes";
import {v4 as uuidv4} from 'uuid';
import {ThermalFileInstance} from "./ThermalFileInstance";

type ThermalMouseEvent = MouseEvent & {
    layerX: number,
    layerY: number
}

/** Stores data of a thermal file and handles the canvas drawing */
export class ThermalFileSource {




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
    ) {
    }

    public createInstance(
        groupId: string,
        frameId?: string
    ) {

        return new ThermalFileInstance(
            this.url,
            this.signature,
            this.unit,
            this.width,
            this.height,
            this.timestamp,
            this.pixels,
            this.min,
            this.max,
            groupId,
            frameId ?? uuidv4()
        );

    }


}