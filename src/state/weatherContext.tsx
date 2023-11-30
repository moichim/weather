"use client";

import { Serie } from "@/graphql/weather";
import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties";
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

type GraphDataEntriesFormat = {
    time: string[]
} & {
        [K in AvailableWeatherProperties]: number[]
    }

type GraphDataSerieFormat = {
    source: WeatherSourceType,
    entries: GraphDataEntriesFormat
}

type GraphDataFormat = GraphDataSerieFormat[];

const prepareSerieForGraph = (data: Serie): GraphDataSerieFormat => {

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
    weatherRange: Serie[]
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