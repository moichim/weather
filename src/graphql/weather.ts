import gql from "graphql-tag"
import { Sources, WeatherSourceType } from "./weatherSources/source";
import { Properties } from "./weatherSources/properties";
import { Source } from "postcss";
import { OpenmeteoProvider } from "./providers/openmeteoProvider";

export type WeatherEntryMetaType = {
    time: number,
    source: string,
    is_forecast: boolean,
}

export type WeatherEntryDataType = {
    temperature: number,
    wind_dir?: string,
    wind_speed?: number,
    bar?: number,
    rain?: number,
    clouds?: number,
    humidity?: number,
    uv?: number
}

export type WeatherEntryType = WeatherEntryMetaType & WeatherEntryDataType;

export type Serie = {
    source: WeatherSourceType,
    entries: WeatherEntryType[]
}

export const weatherTypeDefs = gql`

    extend type Query {
        weatherRange(from:Int,to:Int): [Serie]
        weatherSingle(time:Int): [Serie]
        sources: [Source]
        properties: [Property]
    }

    type Serie {
        source: Source!
        entries:[Entry]
    }

    type Entry {
        time: Int!
        is_forecast: Boolean!
        temperature: Float!
        wind_dir: String
        wind_speed: Float
        bar: Float
        rain: Float
        clouds: Float
        humidity: Float
        uv: Float
    }

    type Property {
        type: String!
        unit: String
        name: String!
        field: String
        in: [String],
        color: String!,
        slug: String
    }

    type Source {
        name: String!
        color: String!
        slug: String!
        props:[String]
    }

`;

const provider = new OpenmeteoProvider;

export const weatherResolvers = {

    Query: {
        weatherRange: async ( 
            from: number, 
            to: number, 
            sources: string[] = [] 
        ): Promise<Serie[]> => {

            return Promise.all([
                provider.range( from, to )
            ]);

        },
        weatherSingle: async (time:number): Promise<Serie[]> => {
            return await []
        },
        sources: () => Sources.all(),
        properties: () => Properties.all()
    }

}