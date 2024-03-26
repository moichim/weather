"use client";

import { useLazyQuery, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import { ThermoFileDefinition, ThermoFileScope } from "../graphql/files";
import { ThermalFileRequest } from "../registry/ThermalRequest";

export const PROJECT_FILES_QUERY = gql`

query Scopes($scope: String!, $from: Float, $to: Float) {
    scopeFiles(scope: $scope, from: $from, to: $to) {
      files {
        filename
        timestamp
        thermalUrl
        visibleUrl
      }
      info {
        slug
        name
        scope
        description
      }
    }
  }

`;

type ProjectFolserDefinition = {
    id: string,
    name: string,
    description?: string
    files: ThermalFileRequest[]
};
type ProjectDescription = {
    [index: string]: ProjectFolserDefinition
}

type ProjectFilesQueryResponse = {
    scopeFiles: {
        info: ThermoFileScope,
        files: ThermoFileDefinition[]
    }[]
}

/**
 * Requests information about the scope's files
 */
export const useProjectLoader = (
    scopeId: string,
    from: number,
    to: number
) => {

    const [groups, setGroups] = useState<ProjectDescription>({});

    const addGroup = useCallback((
        id: string,
        files: ThermalFileRequest[],
        name: string,
        description?: string
    ) => {

        setGroups(prev => {

            // if (!Object.keys(prev).includes(id)) {
                return {
                    ...prev,
                    [id]: {
                        id,
                        name,
                        description,
                        files
                    }
                }
            //} 

            return prev;

        });

    }, [setGroups]);

    const [fetchQuery, query] = useLazyQuery<ProjectFilesQueryResponse>(PROJECT_FILES_QUERY, {
        variables: {
            scope: scopeId,
            from: from,
            to: to
        },
        ssr: false,
        fetchPolicy: "network-only",
        onCompleted: (result) => {

            result.scopeFiles.forEach(folder => {

                const files: ThermalFileRequest[] = folder.files.map(file => {
                    return {
                        thermalUrl: file.thermalUrl,
                        visibleUrl: file.visibleUrl
                    }
                });

                addGroup(folder.info.slug, files, folder.info.name, folder.info.description);

            });

        }
    });

    useEffect(() => {
        if (query.loading === false) {
            fetchQuery({
                variables: {
                    from: from,
                    to: to,
                    scope: scopeId
                },
                onError: console.error,
                fetchPolicy: "network-only"
            });
        }
            
    }, [from, to]);



    return {
        loading: query.loading,
        groups
    }

}