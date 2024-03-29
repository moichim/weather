"use client";

import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalMinmaxOrUndefined } from "@/thermal/registry/interfaces";
import { useEffect, useState } from "react";

export const useThermalGroupMinmaxProperty = (
    group: ThermalGroup,
    purpose: string
) => {

    const [value, setValue] = useState<ThermalMinmaxOrUndefined>(group.minmax.value);

    // Bind all the values to the local state
    useEffect(() => {

        group.minmax.addListener(purpose, newValue => {

            if (newValue !== value) {
                setValue(newValue);
            }

        });

        return () => group.minmax.removeListener(purpose);

    }, [group]);

    // When this unmounts, remove the listeners
    useEffect(() => {
        return () => group.minmax.removeListener(purpose);
    }, []);

    return {
        value
    }

}