import gql from "graphql-tag"
import { WeatherProperty } from "./weatherSources/properties"
import { GoogleSheetsProvider } from "./googleProvider/googleProvider"

export type GoogleScope = {
    /** Name of the scope */
    name: string,
    /** ID of the scope's data sheet */
    sheetId: string
}

export type GoogleDataColumnDefinition = {
    name: string,
    slug: string,
    color: string,
    description?: string,
    in: WeatherProperty
}

export type GoogleColumnValue = {
    time: number,
    value: number,
    note?: string
}

export type GoogleColumn = GoogleDataColumnDefinition & {
    
    values: GoogleColumnValue[],

    min: number|null,
    max: number|null,
    avg: number|null,
    count: number

}

export type GoogleScopeData = {
    data: GoogleColumn[]
}

export const googleTypeDefs = gql`

    extend type Query {
        range( scope: String, from:String, to:String ): GoogleScopeData
    }

    type GoogleScope {
        name: String!
        sheetId: String!
    }

    type GoogleScopeData {
        data: [GoogleColumn]
    }

    type GoogleColumn {
        name: String!
        slug: String!
        color: String!
        in: Property
        values: [GoogleColumnValue]
        min: Float
        max: Float
        avg: Float
        count: Float
    }

    type GoogleColumnValue {
        time: Float!
        value: Float!
        note: String
    }

`;

export type GoogleRequest = {
    scope: string,
    from: string,
    to: string
}

export const googleResolvers = {

    Query: {
        range: async (
            parent: any,
            args: GoogleRequest
        ) => {

            const data = await GoogleSheetsProvider.range( args );

            return {
                data
            }

        }
    }

}