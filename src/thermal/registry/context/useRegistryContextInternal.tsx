"use client";

import { useEffect, useMemo, useState } from "react";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "../interfaces";
import { MinmaxEvent, OpacityEvent, RangeEvent, ThermalEvents } from "../events";

export const useRegistryContextInternal = () => {

    


    const registry = useMemo(() => {

        return new ThermalRegistry;

    }, []);




    return registry

}

export type UseRegistryContextInternalType = ReturnType<typeof useRegistryContextInternal>;

export const useRegistryContextInternalDefaults: UseRegistryContextInternalType = new ThermalRegistry;