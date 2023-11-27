import gql from "graphql-tag";
import { GraphQLError } from 'graphql';

export type PlaceType = {
    slug: string,
    name: string,
    color: string,
    lat: number,
    lon: number
}

type PlaceIndexType = {
    [index: string]: PlaceType
}

const data:PlaceIndexType = {
    ntc: {
        name: "NTC",
        color: "red",
        slug: "ntc",
        lat: 4,
        lon: 4
    },
    uni: {
        name: "University",
        color: "blue",
        slug: "uni",
        lat: 4,
        lon: 4
    }
}

export const placesTypeDefs = gql`

    extend type Query {
        places: [Place]
        place(slug:String): Place
    }

    type Place {
        slug: String
        name: String
        color: String
        lat: Float
        lon: Float
    }
`;

type PlaceQueryArguments = {
    slug: string
}

export const placesResolvers = {

    Query: {
        /** Return all places */
        places: () => {
            return Object.values( data );
        },
        /** Return a single place by its SLUG */
        place: (_: any, arg: PlaceQueryArguments) => {

            if ( ! Object.keys( data ).includes( arg.slug ) ) {
                throw new GraphQLError( `Place [${arg.slug}] not found!`, {
                    extensions: {
                        code : "NOT_FOUND"
                    }
                } )
            }

            return data[ arg.slug ]

        }
    }
}