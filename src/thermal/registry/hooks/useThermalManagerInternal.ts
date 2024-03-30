"use client";

import { useMemo } from "react";
import { ThermalManager } from "../ThermalManager";

export const useThermalManagerInternal = () => {

    return useMemo( () => {
        return new ThermalManager;
    }, [] );

}