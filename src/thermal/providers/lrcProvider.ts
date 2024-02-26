import gql from "graphql-tag";
import { getScopeContent, getScopeFolders } from "./utils/lrcProviderUtils";

export const thermoTypeDefs = gql`

    extend type Query {
        filesGetContent( scope: String ): [ FilesScopeType ]
    }

    type FilesScopeStructure {
        scope: String
        folders: [String]
    }

    type FileDefinition {
        filename: String!
        timestamp: Float
        ir: String!
        visu: String
    }

    type FilesScopeType {
        id: String!
        name: String!
        description: String
        files: [FileDefinition]
    }

`;

type FilesScopeSerie = string;
type FilesScopeStructure = {
    scope: string,
    folders: FilesScopeSerie[]
}

type FileDefinition = {
    filename: string,
    timestamp: number,
    ir: string,
    visu?: string
}
type FilesScopeType = {
    id: string,
    name: string,
    description?: string,
    files: FileDefinition[]
}
export type FilesScopeContent = FilesScopeType[];

export const thermoResolvers = {

    Query: {

        filesGetStructure: async (
            parent: any,
            args: {
                scope: string
            }
        ) => {

            const content = getScopeFolders(args.scope);
            return content;

        },

        filesGetContent: async (
            parent: any,
            args: {
                scope: string
            }
        ) => {

            const response = getScopeContent(args.scope);

            return response;

        }

    }

}