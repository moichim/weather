"use client";

import { useEffect, useState } from "react";
import { useThermalRegistry } from "../retrieval/useThermalRegistry";
import { PaletteEvent, ThermalEvents } from "@/thermal/registry/events";
import { ThermalPalettes } from "@/thermal/file/palettes";

export const useThermalPalette = () => {

    const registry = useThermalRegistry();

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