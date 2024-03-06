"use client";

import { useMemo } from "react";
import { useRegistryContext } from "./RegistryContext";

export const useGroupInstance = (
    groupId: string
) => {

    const registry = useRegistryContext();

    const group = useMemo( () => {

        return registry.addOrGetGroup( groupId );

    }, [groupId] );

    return group;

}