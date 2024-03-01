import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useState } from "react";
import { FilesScopeContent } from "../providers/lrcProvider";
import { ThermalGroup } from "./group/ThermalGroup";
import { ThermoIrAspectSlider } from "./utils/ThermoIrAspectSlider";

type ThermalProjectFolders = {
    scope: string
}


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

type ProjectFilesQueryResponse = {
    filesGetContent: FilesScopeContent
}

type ThermalProjectFoldersDefinition = {
    name: string,
    id: string,
    description?: string,
    urls: string[]
}

export const ThermalProjectFolders: React.FC<ThermalProjectFolders> = props => {

    const [folders, setFolders] = useState<ThermalProjectFoldersDefinition[]>([]);

    const addFolder = useCallback((
        name: string,
        id: string,
        urls: string[],
        description?: string,
    ) => {

        setFolders(prev => {

            const existingFolders = folders.map(f => f.id);

            if (!existingFolders.includes(id)) {
                return [
                    ...prev, {
                        name, id, description, urls
                    }
                ]
            }

            return prev;

        });

    }, [folders, setFolders]);

    const query = useQuery<ProjectFilesQueryResponse>(PROJECT_FILES_QUERY, {
        variables: {
            scope: props.scope
        },
        onCompleted: data => {
            data.filesGetContent.map( folder => {

                addFolder(
                    folder.name,
                    folder.id,
                    folder.files.map( f => f.ir ),
                    folder.description
                );

            } );
        }
    });

    return <div>

        <ThermoIrAspectSlider />

        {folders.map( folder => <ThermalGroup 
            key={folder.id}
            name={folder.id}
            urls={folder.urls}
        /> )}

    </div>

}