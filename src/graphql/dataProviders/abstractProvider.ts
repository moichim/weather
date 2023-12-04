import { WeatherSerie, WeatherEntryType, WeatherProviderRequest, WeatherSerieIndexType } from "../weather";
import { WeatherSourceType } from "../weatherSources/source";

export interface IProvider {

    fetch: ( from: string, to: string ) => Promise<WeatherEntryType[]>

    // single: ( time: number ) => Promise<Serie>

}

export type AbstractWeatherProviderRawEntryType = {};

export abstract class AbstractWeatherProvider {

    protected source?: WeatherSourceType;

    /** Get the source definition with all its metadata */
    public getSource(): WeatherSourceType {
        if ( this.source === undefined )
            this.source = this.generateSourceDefinition();
        return this.source;
    }

    protected abstract generateSourceDefinition(): WeatherSourceType;

    public async fetch( 
        args: WeatherProviderRequest 
    ): Promise<WeatherSerie> {

        return await this.doRequest( args ).then( response => {
            return {
                source: this.getSource(),
                entries: response
            }
        } )

    }

    protected abstract doRequest( 
        args: WeatherProviderRequest 
    ): Promise<WeatherEntryType[]>;

}
