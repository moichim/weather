import gql from "graphql-tag"
import { WeatherProperty } from "../weather/definitions/properties"
import { googleSheetsProvider } from "./googleProvider/googleProvider"

export type GoogleScope = {
    /** Name of the scope */
    name: string,
    slug: string,
    /** ID of the scope's data sheet */
    sheetId: string,
    lat: number,
    lon: number,
    hasNtc: boolean,
    isDefault: boolean,
    team: string,
    locality: string,
    description: string,
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
        range( scope: String, lat: Float!, lon: Float!, from:Float, to:Float ): GoogleScopeData
        googleScope( scope: String! ): GoogleScope
        googleScopes: [GoogleScope]
    }

    type GoogleScope {
        name: String!
        slug: String!
        sheetId: String!
        lat: Float!
        lon: Float!
        hasNtc: Boolean!
        isDefault: Boolean!
        team: String!
        locality: String!
        description: String!
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
    lat: number,
    lon: number,
    from: number,
    to: number
}

export const googleResolvers = {

    Query: {
        range: async (
            parent: any,
            args: GoogleRequest
        ) => {

            const data = await googleSheetsProvider.range( args );

            return {
                data
            }

        },
        googleScope: async (
            parent: any,
            args: {
                scope: string
            }
        ) => {
            return await googleSheetsProvider.getScope( args.scope );
        },
        googleScopes: async () => {
            return await googleSheetsProvider.getAllScopes();
        }
    }

}