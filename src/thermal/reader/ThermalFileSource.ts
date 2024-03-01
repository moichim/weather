import { ThermalLoader } from "../parsers/thermalLoader";
import { ThermalFileInstance } from "./ThermalFileInstance";
import ThermalFile from "./thermalFile";

/** Stores data of a thermal file and creates instances. */
export class ThermalFileSource extends ThermalFile {

    public static async fromUrl(
        thermalUrl: string,
        visibleUrl?: string
    ): Promise<ThermalFileSource|null> {

        const file = await ThermalLoader.fromUrl( thermalUrl, visibleUrl );

        if ( ! file ) 
            return null;

        file.dispatchEvent( new Event("sourcecreated") );

        return file;

    }

    public createInstance(
        groupId: string,
        frameId: string
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
            frameId
        );

    }


}