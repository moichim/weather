"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useEffect, useMemo, useState } from "react";

export const useThermalOpacityHighlightDrive = (
    registry: ThermalRegistry,
    purpose: string
) => {

    const [value, setValue] = useState<number | undefined>(registry.highlight.value);

    // Bind all the values to the local state
    useEffect(() => {

        registry.highlight.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => registry.highlight.removeListener(purpose);

    }, [registry]);


    // The highlighting function
    const setTime = useMemo(() => registry.highlight.higlightTime, [registry]);


    // The clearing function
    const clear = useMemo(() => registry.highlight.clearHighlight, []);


    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => registry.highlight.removeListener(purpose);
    }, []);


    return {
        value,
        setTime,
        clear
    }

}