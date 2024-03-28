"use client";

import { useMemo } from "react";
import { useThermalRegistry } from "./useThermalRegistry";


/** @deprecated */
export const useThermalGroup = (
    groupId: string,
    forceActivation: boolean = false
) => {

    const registry = useThermalRegistry();

    const group = useMemo( () => {

        const g = registry.addOrGetGroup( groupId );
        if ( forceActivation ) {
            g.recieveActivationStatus( true );
        }

        return g;

    }, [ groupId ] );

    return group;

}