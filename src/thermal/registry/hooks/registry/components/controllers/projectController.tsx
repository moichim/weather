"use client";

import { Navbar } from "@/components/navigation/utils/Navbar";
import { useTimeContext } from "@/state/time/timeContext";
import { useProjectLoader } from "@/thermal/context/useProjectLoader";
import { Spinner } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { useThermalManagerContext } from "../../../thermalManagerContext";
import { useThermalRegistryNew } from "../../useThermalRegistryNew";
import { RegistryDisplay } from "../displays/registryDisplay";


type ProjectDisplayProps = {
    scopeId: string
}

/**
 * The master controller of a scope.
 * 
 * Creates and removes the registry upon unmount. Use only once per page & scope!
 * 
 * There may be more scopes. The parameter `scope` corresponds to values returned by `/graphql/google/googleProvider`
 */
export const ProjectController: React.FC<ProjectDisplayProps> = props => {

    // Store the ID once for all to prevent ID changes
    const registryId = useMemo( () => {
        return props.scopeId;
    }, [] );

    // Observe the time state
    const { timeState } = useTimeContext();

    // The global manager instance is used for removal of the registry on unmount
    const manager = useThermalManagerContext();


    // Hold the instance of the registry
    const registry = useThermalRegistryNew( registryId );


    // Load and update the project files definitions
    /** @todo Implement API loading behaviour. */
    const {loading, projectDescription } = useProjectLoader( registryId, timeState.from, timeState.to );


    // Everytime the definition changes, reload the entire registry
    useEffect( () => {

        registry.loadProject( projectDescription )

    }, [projectDescription] );


    // Remove the registry on unmount
    useEffect( () => {

        return () => manager.removeRegistry( registryId );

    }, [] );


    return <>

        <Navbar
            className="bg-slate-200"
            height="6rem"
        />

        <RegistryDisplay registry={registry}/>

    </>

}