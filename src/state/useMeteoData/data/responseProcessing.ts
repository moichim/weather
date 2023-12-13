import { WeatherEntryType, WeatherSerie } from "@/graphql/weather";
import { MeteoQueryResponseType } from "./query";
import { Properties } from "@/graphql/weatherSources/properties";

type BufferEntryType = {
    [index:string]: number|undefined
} & {
    time: number,
    note?: string
}

type BufferType = {
    [index: string]: BufferEntryType
}

export class MeteoResponseProcessor {

    public static process(
        response: MeteoQueryResponseType
    ) {

        console.log( "S" );

        // Najde nejdelší serii
        const longestSerie = MeteoResponseProcessor.getLongestWeatherSerie(response.weatherRange);

        // Namapovat google values na index podle času
        const googleIndex = MeteoResponseProcessor.dumpGoogleDataToTimeEntries( response.range );
        const weatherIndex = MeteoResponseProcessor.dumpWeatherSerieToTimeEntries( response.weatherRange );

        console.log( googleIndex, weatherIndex );

        // Iteruje všechny properties a vrátí index namapovaných dat pro graf
        const properties = Properties.all();
        const graphData = Object.fromEntries( properties.map(property => {

            const lines = response.weatherRange.map( serie => serie.source );

            const data = longestSerie.entries.map( leadEntry => {

                const entry: BufferEntryType = {
                    time: leadEntry.time
                }

                lines.forEach( l => {

                    const value = weatherIndex[ l.slug ][leadEntry.time][property.slug];

                    entry[l.slug] = value ?? undefined;

                } );

                response.range.data.forEach( column => {

                    const record = googleIndex[ leadEntry.time ];

                    entry[column.slug] = record
                        ? record[column.slug]
                        : undefined

                } );

                return entry;

            } )

            // Podívá se pro každou weather serii a najde její data případně undefined

            // podívá se na kažtý google a najde jeho hodnotu, případně undefined


            return [property.slug, data ]

        }));

        console.log( "E", graphData );

        return {
            graphData
        }


    }

    protected static dumpWeatherSerieToTimeEntries(
        weather: MeteoQueryResponseType["weatherRange"]
    ) {

        return Object.fromEntries( weather.map( serie => {
            const timedEntries = Object.fromEntries( serie.entries.map( entry => [entry.time, entry] ) );
            return [ serie.source.slug, timedEntries ]
        } ) );

    }

    protected static dumpGoogleDataToTimeEntries(
        google: MeteoQueryResponseType["range"]
    ) {

        let buffer: BufferType = {};

        for (let column of google.data) {

            for (let entry of column.values) {

                if (Object.keys(buffer).includes(entry.time.toString())) {
                    buffer[entry.time][column.slug] = entry.value;
                } else {
                    buffer[entry.time] = {
                        time: entry.time,
                        [column.slug]: entry.value,
                        note: entry.note
                    } as BufferEntryType
                }

            }

        }

        return buffer;

    }

    protected static getLongestWeatherSerie(
        series: MeteoQueryResponseType["weatherRange"]
    ): WeatherSerie {
        return series.reduce((state, current) => {
            if (state === undefined)
                return current;
            if (state.entries.length < current.entries.length)
                return current;
            return state;
        }, undefined as undefined | WeatherSerie)!
    }

}

export type MeteoDataProcessed = ReturnType<typeof MeteoResponseProcessor["process"]>