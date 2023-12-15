import { MeteoRequestType } from "@/state/useMeteoData/data/query";
import { WeatherSerie, WeatherEntryType, WeatherProviderRequest, WeatherSerieIndexType, WeatherStatistics, WeatherStatistic } from "../weather";
import { WeatherSourceType } from "../weatherSources/source";
import { Properties } from "../weatherSources/properties";

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
        args: MeteoRequestType 
    ): Promise<WeatherSerie> {

        return await this.doRequest( args ).then( response => {
            return {
                source: this.getSource(),
                entries: response,
                statistics: this.calculateStatistics( response )
            }
        } )

    }

    protected abstract doRequest( 
        args: MeteoRequestType 
    ): Promise<WeatherEntryType[]>;

    protected calculateStatistics( payload: WeatherSerie["entries"] ): WeatherStatistics {

        const properties = Properties.all().map( p => p.slug );

        return Object.fromEntries( properties.map( propertySlug => {

            let min: number|undefined = payload.reduce( (state, current) => {

                if ( current[propertySlug]! < state )
                    return current[propertySlug] as number;
                return state;

            }, Infinity );

            let max: number|undefined = payload.reduce( (state, current) => {

                if ( current[propertySlug]! > state )
                    return current[propertySlug] as number;
                return state;

            }, -Infinity );

            const count = payload.length;

            const avg = payload.reduce( (state, current) => {
                return state + current[propertySlug]!
            }, 0 ) / count;

            min = min === Infinity ? undefined : isNaN(min) ? undefined : min;
            max = max === -Infinity ? undefined : isNaN(max) ? undefined : max;


            const statistics: WeatherStatistic = {
                min: min,
                max: max,
                avg: isNaN(avg) ? undefined : avg, 
                count
            }

            return [propertySlug, statistics]
        } ) );

    }

}
