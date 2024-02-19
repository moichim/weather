import { IRON, ThermalPalettes } from "@/thermal/components/instance/palettes";
import {v4 as uuidv4} from 'uuid';

type ThermalMouseEvent = MouseEvent & {
    layerX: number,
    layerY: number
}

export default abstract class ThermalFile {

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

    public getMinMax() {
        return {
            min: this.min,
            max: this.max
        }
    }


}