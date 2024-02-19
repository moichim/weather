import { IRON, ThermalPalettes } from "@/thermal/components/instance/palettes";
import {v4 as uuidv4} from 'uuid';
import {ThermalFileInstance} from "./ThermalFileInstance";
import ThermalFile from "./thermalFile";

type ThermalMouseEvent = MouseEvent & {
    layerX: number,
    layerY: number
}

/** Stores data of a thermal file and handles the canvas drawing */
export class ThermalFileSource extends ThermalFile {

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