"use client";

import { WeatherEntryType, WeatherSerie } from "@/graphql/weather";
import { AvailableWeatherProperties, Properties, WeatherProperty } from "@/graphql/weatherSources/properties";
import { WeatherSourceType } from "@/graphql/weatherSources/source";
import { OperationVariables, QueryResult, gql, useQuery } from "@apollo/client";
import { createContext, useContext, useState, useMemo } from "react";
import { useFilterContext } from "./filterContext";

const properties = Properties.all();

type QueryHookType = QueryResult<WeatherQueryType, OperationVariables>;

type WeatherContextType = {
    weather: GraphDataFormat,
    data: QueryHookType["data"],
    error?: QueryHookType["error"],
    loading: boolean,

}

const initialData: WeatherContextType = {
    weather: [],
    data: {
        weatherRange: []
    },
    loading: false
}

type GraphWeatherEntryType = {
    time: string[]
} & {
        [K in AvailableWeatherProperties]: number[]
    }

type GraphDataSerieFormat = {
    source: WeatherSourceType,
    entries: {
        [index: number]: WeatherEntryType
    }
}

type GraphDataFormat = GraphDataSerieFormat[];

const prepareSerieForGraph = (data: WeatherSerie): GraphDataSerieFormat => {

    const formatted = {
        time: [] as string[],
        ...Properties.skeleton()
    };

    data.entries.forEach(entry => {

        formatted.time.push(entry.time.toString());

        data.source.props.forEach(prop => {

            formatted[prop].push(entry[prop]!);

        });

    });

    return {
        source: data.source,
        entries: formatted
    };


}

const createGraphSequenceFromSlug = (slug: string) => [slug, [] as number[]];

const createGraphEmtryFromSlug = (slug: string) => [slug, null as number|null ];


const graphEntryFactory = (
    time: number,
    sources: string[],
    values: string[]
) => {
    return Object.fromEntries( [
        [ "time", time ],
        ...sources.map( s => createGraphEmtryFromSlug( s ) ),
        ...values.map( v => createGraphEmtryFromSlug( v ) )
    ] );
}

export const prepareGraphData = (
    property: AvailableWeatherProperties,
    queryResponse: WeatherQueryType
) => {

    const prop = Properties.one(property);
    const availableSources = prop.in;

    const availableValues = ["some_value", "some_other_value"];

    const allGraphSequences = [...availableSources, ...availableValues];

    const dataBuffer = Object.fromEntries([
        createGraphSequenceFromSlug("time"),
        ...allGraphSequences.map(s => createGraphSequenceFromSlug(s))
    ]) as {
        [index: string]: (number | null)[]
    } & {
        time: number[]
    };

    const records: any[] = [];

    console.log(dataBuffer);

    if (Object.keys(queryResponse.weatherRange).length > 0) {

        // Pick the longest serie that will be iterated later
        const longestSerie = queryResponse.weatherRange.reduce((state, current) => {

            if (current.entries.length > state.entries.length)
                return current;
            return state;

        }, queryResponse.weatherRange[0]);


        // Iterate over the longest serie and accompany all entries
        longestSerie.entries.forEach((entry, index) => {


            const item = graphEntryFactory( entry.time, availableSources, availableValues );

            // Append the time record
            dataBuffer.time.push(entry.time);

            // Iterate over all sources and push the value to the corresponding buffer sequences
            Object.values(queryResponse.weatherRange)
                .filter(serie => availableSources.includes(serie.source.slug))
                .forEach(serie => {                    

                    const value = serie.entries[index] !== undefined
                        ? serie.entries[index][property] as number
                        : null;

                    item[ serie.source.slug ] = value;

                    dataBuffer[serie.source.slug].push(value);

                });


            // Iterate over all custom values and pass them into a buffer
            availableValues.forEach( valueSlug => {
                dataBuffer[ valueSlug ].push( null );
                item[ valueSlug ] = undefined;
            } );

            records.push( item );


        });


    }

    return {
        property: prop,
        data: records,
        lines: queryResponse.weatherRange.map(serie => serie.source),
        dots: availableValues
    }

}


const WeatherContext = createContext<WeatherContextType>(initialData);

const API_REQUEST = gql`
query Query($from: String, $to: String) {
    weatherRange(from: $from, to: $to) {
      source {
        name
        props
        slug
        color
        stroke
      }
      entries {
        bar
        humidity
        clouds
        time
        temperature
        uv
        rain
        clouds
        wind_dir
        wind_speed
        radiance
      }
    }
  }
`;

type WeatherQueryType = {
    weatherRange: WeatherSerie[]
}

export const DataContextProvider: React.FC<React.PropsWithChildren> = props => {

    const [weather, setWeather] = useState<GraphDataFormat>([]);

    const { from, to } = useFilterContext();

    const query = useQuery<WeatherQueryType>(API_REQUEST, {

        variables: {
            from: from,
            to: to
        },

        onCompleted: d => {

            const series = d.weatherRange.map(s => prepareSerieForGraph(s));

            console.log(series);

            setWeather(series);

        },

        onError: e => {

            console.error("error loading data", e);

        }

    });


    const value: WeatherContextType = {
        weather: weather,
        data: query.data,
        loading: query.loading,
        error: query.error,
    };

    return <WeatherContext.Provider value={value}>
        {props.children}
    </WeatherContext.Provider>

}

export const useWeatherContext = () => {
    return useContext(WeatherContext);
}