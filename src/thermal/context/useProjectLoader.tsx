"use client";

import { FilesScopeContent } from "@/thermal/providers/lrcProvider";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useState } from "react";
import { ThermalFileRequest } from "../registry/ThermalRequest";

export const PROJECT_FILES_QUERY = gql`

query Query($scope: String) {
    filesGetContent(scope: $scope) {
      name
      description
      id
      files {
        filename
        ir
        visu
        timestamp
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
    filesGetContent: FilesScopeContent
}

/**
 * Requests information about the scope's files
 */
export const useProjectLoader = (
    scopeId: string
) => {

    const [groups, setGroups] = useState<ProjectDescription>({});

    const addGroup = useCallback((
        id: string,
        files: ThermalFileRequest[],
        name: string,
        description?: string
    ) => {

        setGroups(prev => {

            if (!Object.keys(prev).includes(id)) {
                return {
                    ...prev,
                    [id]: {
                        id,
                        name,
                        description,
                        files
                    }
                }
            }

            return prev;

        });

    }, [setGroups]);

    const query = useQuery<ProjectFilesQueryResponse>(PROJECT_FILES_QUERY, {
        variables: {
            scope: scopeId
        },
        onCompleted: (result) => {

            result.filesGetContent.forEach(folder => {

                const files: ThermalFileRequest[] = folder.files.map(file => {
                    return {
                        thermalUrl: file.ir,
                        visibleUrl: file.visu
                    }
                });

                addGroup(folder.id, files, folder.name, folder.description);

            });

        }
    });

    return {
        loading: query.loading,
        groups
    }

}