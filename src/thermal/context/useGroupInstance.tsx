"use client";

import { useMemo } from "react";
import { useRegistryContext } from "./RegistryContext";

/** 
 * Returns the `ThermalGroup` instance 
 * 
 * Creates the instance by ID or return the existing one.
*/
export const useGroupInstance = (
    groupId: string
) => {

    const registry = useRegistryContext();

    const group = useMemo( () => {

        return registry.addOrGetGroup( groupId );

    }, [groupId] );

    return group;

}