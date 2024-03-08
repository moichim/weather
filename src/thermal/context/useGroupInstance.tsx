"use client";

import { useMemo } from "react";
import { useRegistryContext } from "./RegistryContext";
import { ThermalEventsFactory } from "../registry/events";

/** 
 * Returns the `ThermalGroup` instance 
 * 
 * Creates the instance by ID or return the existing one.
*/
export const useGroupInstance = (
    groupId: string,
    forceReady: boolean = false
) => {

    const registry = useRegistryContext();

    const group = useMemo( () => {

        const g = registry.addOrGetGroup( groupId );
        if ( forceReady ) {
            g.dispatchEvent( ThermalEventsFactory.groupLoadingEnd( g ) )
        }

        return g;

    }, [groupId] );

    return group;

}