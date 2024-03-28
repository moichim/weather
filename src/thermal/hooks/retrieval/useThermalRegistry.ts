"use client";

import { useRegistryContext } from "@/thermal/context/RegistryContext"

export const useThermalRegistry = () => {
    const {registry} = useRegistryContext();
    return registry;
}