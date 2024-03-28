"use client";

import { useEffect, useMemo } from "react";
import { ThermalRegistry } from "../registry/ThermalRegistry";
import { useThermalMinmax } from "../hooks/propertyListeners/useThermalMinmax";
import { useThermalOpacity } from "../hooks/propertyListeners/useThermalOpacity";
import { useThermalRange } from "../hooks/propertyListeners/useThermalRange";
import { useThermalPalette } from "../hooks/propertyListeners/useThermalPalette";
import { ThermalPalettes } from "../file/palettes";
import { useThermalLoadingState } from "../hooks/propertyListeners/useThermalLoadingState";
import { ThermalContainerStates } from "../registry/abstractions/ThermalObjectContainer";
import { useThermalHistogram } from "../hooks/propertyListeners/useThermalHistogram";

/**
 * Creates and stores the global instance of the `ThermalRegistry` 
 * and listens to its core bglobal parameters
 * - minmax
 * - opacity
 * - range
 * - palette
 * - loading state
 */
export const useRegistryContextInternal = () => {

    const registry = useMemo(() => {

        return new ThermalRegistry;

    }, []);

    const { minmax } = useThermalMinmax(registry);
    const { opacity, imposeGlobalOpacity } = useThermalOpacity(registry);
    const { range, imposeGlobalRange } = useThermalRange(registry);
    const { thermalPalette, thermalPaletteSlug, setThermalPalette, availableThermalPalettes } = useThermalPalette(registry);
    const { loadingState } = useThermalLoadingState(registry);
    const { histogram } = useThermalHistogram(registry);

    useEffect(() => {
        console.log("změna loading stavu registru", loadingState);
    }, [loadingState]);

    return {
        registry,
        minmax,
        opacity,
        imposeGlobalOpacity,
        range,
        imposeGlobalRange,
        thermalPalette,
        thermalPaletteSlug,
        setThermalPalette,
        availableThermalPalettes,
        loadingState,
        histogram
    }

}

export type UseRegistryContextInternalType = ReturnType<typeof useRegistryContextInternal>;

export const useRegistryContextInternalDefaults: UseRegistryContextInternalType = {
    registry: new ThermalRegistry,
    opacity: 1,
    minmax: undefined,
    range: undefined,
    imposeGlobalOpacity: () => { },
    imposeGlobalRange: () => { },
    thermalPalette: ThermalPalettes.jet,
    thermalPaletteSlug: "jet",
    setThermalPalette: () => { },
    availableThermalPalettes: {},
    loadingState: ThermalContainerStates.EMPTY,
    histogram: undefined
};