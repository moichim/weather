import { GoogleScope } from "@/graphql/google";
import gql from "graphql-tag";

export type GoogleScopeQueryRequest = {};

export type GoogleScopesQueryResponse = {
    googleScopes: GoogleScope[]
}

export const GOOGLE_SCOPES_QUERY = gql`

    query GoogleScopes {
        googleScopes {
           name
            slug
            sheetId
            lat
            lon
            hasNtc
            isDefault
            team
            locality
            description
        }
    }

`;