"use client";

import { ThermalPalettes } from "@/thermal/file/palettes";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { PaletteEvent, ThermalEvents } from "@/thermal/registry/events";
import { useEffect, useState } from "react";

export const useThermalPalette = (
    registry: ThermalRegistry
) => {

    const [palette, setPalette] = useState(registry.currentPalette);
    const [slug, setSlug] = useState(registry.palette);

    useEffect(() => {

        const paletteListener = (evt: Event) => {
            const event = evt as PaletteEvent;

            // if (event.detail.slug !== registry.palette) {
                setPalette(event.detail.palette);
                setSlug(event.detail.slug);
            // }
        }

        registry.addEventListener(ThermalEvents.PALETTE_CHANGED, paletteListener);

        return () => registry.removeEventListener(ThermalEvents.PALETTE_CHANGED, paletteListener);

    }, [registry, palette, setPalette, slug, setSlug]);

    const setThermalPalette = ( slug: keyof typeof ThermalPalettes ) => {
        registry.palette = slug;
    }

    return {
        thermalPalette: palette, 
        thermalPaletteSlug: slug,
        setThermalPalette,
        availableThermalPalettes: registry.availablePalettes
    }

}