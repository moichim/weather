import gql from "graphql-tag";
import { filesProvider } from "./filesProvider";

export type ThermoFileDefinition = {
    filename: string,
    timestamp: number,
    thermalUrl: string,
    visibleUrl?: string
}

export type ThermoFileScope = {
    slug: string,
    name: string,
    description: string
}

export const fileTypeDefs = gql`

    extend type Query {
        scopeFiles( scope: String ): [ThermalFolderRepsonse]
    }

    type ThermalFolderRepsonse {
        info: ThermalFolderDefinition
        files: [ThermalFileDefinition]
    }


    type ThermalFileDefinition {
        filename: String!
        timestamp: Float
        thermalUrl: String!
        visibleUrl: String
    }

    type ThermalFolderDefinition {
        slug: String!
        name: String!
        scope: String!
        description: String
    }

`;

export const fileResolvers = {
    Query: {

        scopeFiles: async (
            parents: any,
            args: {
                scope: string
            }
        ) => {
            return await filesProvider.fetchScopeContent( args.scope );
        },


    }
}