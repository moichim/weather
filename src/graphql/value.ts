import gql from "graphql-tag"
import { WeatherProviderRequest } from "./weather"
import { AvailableWeatherProperties, WeatherProperty } from "./weatherSources/properties"
import { ValueProvider } from "./valueProvider/valueProvider"

export type ValueEntryType = {
    time: number,
    value: number,
    note?: string
}

type ValueindexType = {
    [index:number]: ValueEntryType
}

export type ValueSerieDefinition = {
    name: string,
    slug: string,
    id: number,
    color: string,
    in: WeatherProperty[]
}

export type ValueSerieResponseType = ValueSerieDefinition & {
    values: ValueEntryType[]
}

export type ValueSerieProcessedType = ValueSerieDefinition & {
    values: ValueindexType
}

export const valueTypeDefs = gql`

    extend type Query {
        valueRange(from:String,to:String): [ValueSerie]
    }

    type Value {
        time: Float!
        value: Float!
        note: String
    }

    type ValueSerie {
        name: String!
        slug: String!
        id: Int!
        color: String!
        in: [Property!]
        values: [Value]
    }

`;

const provider = new ValueProvider;

export const valueResolvers = {

    Query: {
        valueRange: async ( 
            parent: any, 
            args: WeatherProviderRequest, 
        ): Promise<ValueSerieResponseType[]> => {

            return await provider.getAllSeries( args )

        },
    }

}