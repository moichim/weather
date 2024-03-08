"use client";

import { Spinner } from "@nextui-org/react";
import { useProjectLoader } from "../context/useProjectLoader";
import { useRegistryListener } from "../context/useRegistryListener";
import { ThermalGroup } from "./ThermalGroup";

type ProjectControllerProps = {
    scope: string
}

/**
 * The master controller of a scope.
 * 
 * There may be more scopes. The parameter `scope` corresponds to values returned by `/graphql/google/googleProvider`
 */
export const ProjectController: React.FC<ProjectControllerProps> = props => {

    const { groups, loading } = useProjectLoader(props.scope);

    const listener = useRegistryListener();

    return <>

        {(loading === true || listener.ready === false) &&
            <div className="text-center text-white py-40" style={{ padding: "10rem 0rem" }}>
                <Spinner />
                <p>Načítám</p>
            </div>
        }

        <div className="flex flex-wrap">
            {Object.entries(groups).map(([groupId, definition]) => {
                return <ThermalGroup
                        key={groupId}
                        groupId={groupId}
                        name={definition.name}
                        description={definition.description}
                        files={definition.files}
                    />
            })}
        </div>
    </>

}