"use client";

import { useMemo } from "react";
import { ThermalRegistry } from "../ThermalRegistry";

export const useRegistryContextInternal = () => {

    const registry = useMemo(() => {

        return new ThermalRegistry;

    }, []);

    return registry

}

export type UseRegistryContextInternalType = ReturnType<typeof useRegistryContextInternal>;

export const useRegistryContextInternalDefaults: UseRegistryContextInternalType = new ThermalRegistry;