"use client";

import { useEffect, useState } from "react";
import { MinmaxEvent, OpacityEvent, RangeEvent, ThermalEvents } from "../events";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "../interfaces";
import { useRegistryContext } from "./RegistryContext";

export const useRegistryListener = () => {

    const [opacity, setOpacity] = useState<number>(1);
    const [range, setRange] = useState<ThermalRangeOrUndefined>(undefined);
    const [minmax, setMinmax] = useState<ThermalMinmaxOrUndefined>(undefined);

    const registry = useRegistryContext();

    useEffect(() => {

        // Add bindings


        // Opacity
        const opacityListener = (evt: Event) => {
            const e = event as OpacityEvent;
            setOpacity(e.detail.opacity);
        }

        registry.addEventListener(ThermalEvents.OPACITY_UPDATED, opacityListener);


        // Range
        const rangeListener = (evt: Event) => {
            const e = evt as RangeEvent;
            setRange(e.detail.range);
        }

        registry.addEventListener(ThermalEvents.RANGE_UPDATED, rangeListener);


        // Min max
        const minmaxListener = (evt: Event) => {
            const e = evt as MinmaxEvent;
            setMinmax(e.detail.minmax);
        }

        registry.addEventListener(ThermalEvents.MINMAX_UPDATED, minmaxListener);

        return () => {
            registry.removeEventListener(ThermalEvents.OPACITY_UPDATED, opacityListener);
            registry.removeEventListener(ThermalEvents.RANGE_UPDATED, rangeListener);
            registry.removeEventListener(ThermalEvents.MINMAX_UPDATED, minmaxListener);
        }


    }, [registry, setRange, setOpacity, setMinmax]);

    useEffect(() => {

        if (opacity !== registry.opacity) {

            registry.imposeOpacity(opacity);

        }

    }, [registry, opacity]);

    useEffect(() => {

        if (registry.range === undefined && range !== undefined) {
            registry.imposeRange(range);
        } else if (registry.range === undefined && range === undefined) {

        } else if (registry.range !== undefined && range !== undefined) {
            if (
                registry.range.from !== range.from
                || registry.range.to !== range.to
            ) {
                registry.imposeRange(range);
            }
        }

    }, [registry, range]);

    return {
        range, setRange,
        opacity, setOpacity,
        minmax
    }
}