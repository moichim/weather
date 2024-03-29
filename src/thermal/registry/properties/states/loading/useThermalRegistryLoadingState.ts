"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useState } from "react";

export const useThermalRegistryLoadingState = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<boolean>(registry.loading.value);

    // Bind all the values to the local state
    useEffect(() => {

        registry.loading.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => registry.loading.removeListener(purpose);

    }, [registry]);



    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.loading.removeListener(purpose);
    }, []);

    return {
        value
    }

}