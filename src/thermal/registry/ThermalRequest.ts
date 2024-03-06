import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalRegistry } from "./ThermalRegistry";

export type ThermalFileRequest = {
    thermalUrl: string,
    visibleUrl?: string
}

export class ThermalRequest extends EventTarget {

    protected constructor(
        public readonly group: ThermalGroup,
        public readonly url: string,
        public readonly visibleUrl?: string
    ) {
        super();
    }

    public static single(
        group: ThermalGroup,
        thermalUrl: string,
        visibleUrl?: string
    ) {
        return new ThermalRequest( group, thermalUrl, visibleUrl );
    }

    public static multiple( 
        group: ThermalGroup,
        requests: ThermalFileRequest[]
    ) {
        return requests.map( request => new ThermalRequest( group, request.thermalUrl, request.visibleUrl ) );
    }

    public async fetch() {

        if ( this.group.registry.isUrlRegistered( this.url ) ) {
            return this.group.registry.sourcesByUrl[ this.url ];
        }

        const file = await ThermalFileSource.fromUrl( this.url, this.visibleUrl ) as unknown as ThermalFileSource;

        if ( !file ) {
            return null;
        } else if ( file !== null ) {
            this.dispatchEvent( new CustomEvent<{file: ThermalFileSource}>( "loaded", { detail: { file: file as unknown as ThermalFileSource }} ) );
            return file;
        }

        return null;

        

    }

}