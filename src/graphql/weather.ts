import gql from "graphql-tag"
import { Sources, WeatherSourceType } from "./weatherSources/source";
import { Properties } from "./weatherSources/properties";
import { Source } from "postcss";
import { OpenmeteoProvider } from "./dataProviders/openmeteoProvider";
import { NtcProvider } from "./dataProviders/ntcProvider";
import { NumberDomain } from "recharts/types/util/types";
import { MeteoRequestType } from "@/state/useMeteoData/data/query";

export type WeatherEntryMetaType = {
    time: number,
}

export type WeatherEntryDataType = {
    temperature: number,
    wind_dir?: number,
    wind_speed?: number,
    bar?: number,
    rain?: number,
    clouds?: number,
    humidity?: number,
    uv?: number,
    radiance?: number,
    snow_depth?: number,
    evapotranspiration?: number
}

export type WeatherStatistic = {
    slug: string,
    min?: number,
    max?: number,
    avg?: number,
    count: number,
    type: "line"|"dot",
    in?: string,
    name: string,
    color: string
}

export type WeatherStatistics = {
    temperature?: WeatherStatistic,
    wind_dir?: WeatherStatistic,
    wind_speed?: WeatherStatistic,
    bar?: WeatherStatistic,
    rain?: WeatherStatistic,
    clouds?: WeatherStatistic,
    humidity?: WeatherStatistic,
    uv?: WeatherStatistic,
    radiance?: WeatherStatistic,
    snow_depth?: WeatherStatistic,
    evapotranspiration?: WeatherStatistic
}

export type WeatherEntryType = WeatherEntryMetaType & WeatherEntryDataType;

export type WeatherSerieIndexType = {
    [index:number]: WeatherEntryType
}

export type WeatherSerie = {
    source: WeatherSourceType,
    entries: WeatherEntryType[],
    statistics: WeatherStatistics
}

export type WeatherProviderRequest = {
    from: string,
    to: string
}

export const weatherTypeDefs = gql`

    extend type Query {
        weatherRange(scope: String, from:Float,to:Float): [Serie]
        sources: [Source]
        properties: [Property]
    }

    type Statistic {
        min: Float
        max: Float
        avg: Float
        count: Float!
    }

    type Statistics {
        time: Statistic
        temperature: Statistic
        wind_dir: Statistic
        wind_speed: Statistic
        bar: Statistic
        rain: Statistic
        clouds: Statistic
        humidity: Statistic
        uv: Statistic
        radiance: Statistic
        evapotranspiration: Statistic
        snow_depth: Statistic
    }

    type Serie {
        source: Source!
        entries:[Entry]
        statistics: Statistics
    }

    type Entry {
        time: Float!
        temperature: Float!
        wind_dir: Float
        wind_speed: Float
        bar: Float
        rain: Float
        clouds: Float
        humidity: Float
        uv: Float
        radiance: Float
        evapotranspiration: Float
        snow_depth: Float
    }

    type Property {
        type: String!
        unit: String
        name: String!
        field: String
        in: [String],
        color: String!,
        slug: String,
        min: Float,
        max: Float
    }

    type Source {
        name: String!
        color: String!
        stroke: String!
        slug: String!
        props:[String]
    }

`;

const openMeteoProvider = new OpenmeteoProvider;
const ntcProvider = new NtcProvider;

export const weatherResolvers = {

    Query: {
        weatherRange: async ( 
            parent: any, 
            args: MeteoRequestType, 
        ): Promise<WeatherSerie[]> => {

            return Promise.all([
                ntcProvider.fetch( args ),
                openMeteoProvider.fetch( args )
            ]);

        },
        sources: () => Sources.all(),
        properties: () => Properties.all()
    }

}