"use client";

import { ThermalPalette } from "@/thermal/file/palettes";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";
import { PaletteId } from "./PaletteDrive";

export const useThermalRegistryPaletteDrive = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<PaletteId>(registry.palette.value);

    const [palette, setPalette] = useState<ThermalPalette>(registry.palette.currentPalette);


    // Bind all the values to the local state
    useEffect(() => {

        registry.palette.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
                setPalette(registry.palette.currentPalette);
            }

        });

        return () => registry.palette.removeListener(purpose);

    }, [registry]);


    // The setter
    const set = useMemo(() => registry.palette.setPalette, [registry]);


    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.palette.removeListener(purpose);
    }, []);


    return {
        value,
        palette,
        set
    }

}