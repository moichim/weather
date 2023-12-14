import { WeatherEntryType, WeatherSerie } from "@/graphql/weather";
import { MeteoQueryResponseType } from "./query";
import { Properties } from "@/graphql/weatherSources/properties";
import { current } from "tailwindcss/colors";
import { Sources } from "@/graphql/weatherSources/source";

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

        // Najde nejdelší serii
        const longestSerie = MeteoResponseProcessor.getLongestWeatherSerie(response.weatherRange);

        // Namapovat google values na index podle času
        const googleIndex = MeteoResponseProcessor.dumpGoogleDataToTimeEntries( response.range );
        const weatherIndex = MeteoResponseProcessor.dumpWeatherSerieToTimeEntries( response.weatherRange );

        // Iteruje všechny properties a vrátí index namapovaných dat pro graf
        const properties = Properties.all();
        const graphData = Object.fromEntries( properties.map(property => {

            // pro každou property najít její zdroje
            const propertySources = property.in;

            // pro každou property najít sloupce v Googlu, které sem patří
            const propertyColumns = response.range.data.filter( column => column.in.slug === property.slug );

            const propertySourceStatistics = Object.fromEntries( propertySources.map( source => [source, {
                type: "line",
                min: Infinity,
                max: -Infinity,
                avg: 0,
                avgBuf: 0,
                count: 0
            }] ) );

            const propertyColumnStatistics = Object.fromEntries( propertyColumns.map( column => [ column.slug, {
                type: "dot",
                min: Infinity,
                max: -Infinity,
                avg: 0,
                avgBuf: 0,
                count: 0
            } ] ) );

            // Pro každou property iterovat nejdelší serii
            const propertyGraphData = longestSerie.entries.map( leadEntry => {

                // extract leading time
                const leadTimestamp = leadEntry.time;

                // create graph entry
                const currentTimeEntry: BufferEntryType = {
                    time: leadTimestamp,
                    note: undefined
                }

                // extract value for each source of this property
                for ( let propertySource of propertySources ) {

                    const indexOfEntriesForThisSource = weatherIndex[ propertySource ];

                    if ( indexOfEntriesForThisSource ) {

                        const entryForThisTimestamp = indexOfEntriesForThisSource[ leadTimestamp ];

                        if ( entryForThisTimestamp ) {

                            const currentValue = entryForThisTimestamp[ property.slug ]!;

                            currentTimeEntry[ propertySource ] = currentValue;

                            const currentStatistics = propertySourceStatistics[propertySource];

                            currentStatistics.count = currentStatistics.count+1;

                            if ( currentValue < currentStatistics.min ) {
                                currentStatistics.min = currentValue;
                            }

                            if ( currentValue > currentStatistics.max ) {
                                currentStatistics.max = currentValue;
                            }

                            currentStatistics.avgBuf = currentStatistics.avgBuf + currentValue;

                        } else {
                            currentTimeEntry[ propertySource ] = undefined;
                        }

                    } else {
                        currentTimeEntry[ propertySource ] = undefined;
                    }

                };

                // Extract value for each google value
                for ( let propertyColumn of propertyColumns ) {

                    const entryForThisTimestamp = googleIndex[ leadTimestamp ];

                    if ( entryForThisTimestamp ) {

                        const currentValue = entryForThisTimestamp[ propertyColumn.slug ];

                        currentTimeEntry[ propertyColumn.slug ] = entryForThisTimestamp[ propertyColumn.slug ] ?? undefined;
                        currentTimeEntry["note"] = entryForThisTimestamp["note"];

                        if ( currentValue ) {

                            const currentStatistics = propertyColumnStatistics[ propertyColumn.slug ];

                            currentStatistics.count = currentStatistics.count + 1;

                            if ( currentValue < currentStatistics.min ) {
                                currentStatistics.min = currentValue;
                            }

                            if ( currentValue > currentStatistics.max ) {
                                currentStatistics.max = currentValue;
                            }

                            currentStatistics.avgBuf = currentStatistics.avgBuf + currentValue;

                        }

                    } else {
                        currentTimeEntry[ propertyColumn.slug ] = undefined;
                    }

                }

                return currentTimeEntry;


            } );

            const statisticsRaw = {
                ...propertySourceStatistics,
                ...propertyColumnStatistics
            };

            const statistics = Object.fromEntries( Object.entries( statisticsRaw ).map( ([key,values]) => {
                const vals = {
                    ...values,
                    avg: values.avgBuf / values.count
                }
                return [key,vals]
            } ) );

            const propertyGraphContent = {
                dots: propertyColumns,
                lines: propertySources.map( source => Sources.one( source )  ),
                data: propertyGraphData,
                statistics
            }


            return [property.slug, propertyGraphContent ]

        }));

        return graphData;


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