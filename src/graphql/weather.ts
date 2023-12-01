import gql from "graphql-tag"
import { Sources, WeatherSourceType } from "./weatherSources/source";
import { Properties } from "./weatherSources/properties";
import { Source } from "postcss";
import { OpenmeteoProvider } from "./dataProviders/openmeteoProvider";
import { NtcProvider } from "./dataProviders/ntcProvider";

export type WeatherEntryMetaType = {
    time: number,
    source: string,
    is_forecast: boolean,
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
    radiance?: number
}

export type WeatherEntryType = WeatherEntryMetaType & WeatherEntryDataType;

export type Serie = {
    source: WeatherSourceType,
    entries: WeatherEntryType[]
}

export const weatherTypeDefs = gql`

    extend type Query {
        weatherRange(from:String,to:String): [Serie]
        weatherSingle(time:Int): [Serie]
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
            args: {from:string,to:string}, 
            sources: string[] = [] 
        ): Promise<Serie[]> => {

            return Promise.all([
                ntcProvider.fetch( args.from, args.to ),
                openMeteoProvider.fetch( args.from, args.to )
            ]);

        },
        weatherSingle: async (time:number): Promise<Serie[]> => {
            return await []
        },
        sources: () => Sources.all(),
        properties: () => Properties.all()
    }

}