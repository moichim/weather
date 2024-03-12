"use client";

import { useRegistryContext } from "@/thermal/context/RegistryContext"

export const useThermalRegistry = () => {
    return useRegistryContext();
}