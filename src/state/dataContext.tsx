"use client";

import { Serie } from "@/graphql/weather";
import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties";
import { WeatherSourceType } from "@/graphql/weatherSources/source";
import { OperationVariables, QueryResult, gql, useQuery } from "@apollo/client";
import { createContext, useContext, useState, useMemo } from "react";
import { useFilterContext } from "./filterContext";

const properties = Properties.all();

type QueryHookType = QueryResult<WeatherQueryType, OperationVariables>;

type DataContextType = {
    weather: GraphDataFormat,
    data: QueryHookType["data"],
    error?: QueryHookType["error"],
    loading: boolean,

}

const initialData: DataContextType = {
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

const DataContext = createContext<DataContextType>(initialData);

const API_REQUEST = gql`
query Query($from: String, $to: String) {
    weatherRange(from: $from, to: $to) {
      source {
        name
        props
        slug
        color
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
            console.log("error loading data", e);
        }

    });


    const value: DataContextType = {
        weather: weather,
        data: query.data,
        loading: query.loading,
        error: query.error,
    };

    return <DataContext.Provider value={value}>
        {props.children}
    </DataContext.Provider>

}

export const useDataContext = () => {
    return useContext(DataContext);
}