import gql from "graphql-tag"
import { Sources, WeatherSourceType } from "./weatherSources/source";
import { Properties } from "./weatherSources/properties";
import { Source } from "postcss";
import { OpenmeteoProvider } from "./dataProviders/openmeteoProvider";
import { NtcProvider } from "./dataProviders/ntcProvider";
import { NumberDomain } from "recharts/types/util/types";

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

export type WeatherEntryType = WeatherEntryMetaType & WeatherEntryDataType;

export type WeatherSerieIndexType = {
    [index:number]: WeatherEntryType
}

export type WeatherSerie = {
    source: WeatherSourceType,
    entries: WeatherEntryType[]
}

export type WeatherProviderRequest = {
    from: string,
    to: string
}

export const weatherTypeDefs = gql`

    extend type Query {
        weatherRange(from:String,to:String): [Serie]
        sources: [Source]
        properties: [Property]
    }

    type Serie {
        source: Source!
        entries:[Entry]
    }

    type Entry {
        time: Float!
        is_forecast: Boolean!
        temperature: Float!
        wind_dir: Float
        wind_speed: Float
        bar: Float
        rain: Float
        clouds: Float
        humidity: Float
        uv: Float
        radiance: Float
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
            args: WeatherProviderRequest, 
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