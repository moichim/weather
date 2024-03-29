"use client";

import { ThermalRegistry, ThermalStatistics } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";

export const useThermalRegistryHistogramState = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<ThermalStatistics[]>(registry.histogram.value);

    // Bind all the values to the local state
    useEffect(() => {

        registry.histogram.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => registry.histogram.removeListener(purpose);

    }, [registry]);

    // Expose the resolution setting
    const setResolution = useMemo( () => registry.histogram.setResolution, [registry] );

    // Expose the recalculation fn
    const recalculate = useMemo( () => registry.histogram.recalculateWithCurrentSetting, [registry] );



    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.histogram.removeListener(purpose);
    }, []);

    return {
        value,
        setResolution,
        recalculate
    }

}