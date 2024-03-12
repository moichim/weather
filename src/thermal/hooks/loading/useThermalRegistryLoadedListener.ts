"use client";

import { useCallback, useEffect, useState } from "react";
import { useThermalRegistry } from "../retrieval/useThermalRegistry";
import { ThermalEvents } from "@/thermal/registry/events";

export const useThermalRegistryLoadedListener = (
    callback: ( event: Event ) => void
) => {

    const registry = useThermalRegistry();

    useEffect( () => {

        registry.addEventListener( ThermalEvents.READY, callback );

        return () => registry.removeEventListener( ThermalEvents.READY, callback );


    }, [ registry, callback ] );

    const stopListening = useCallback( () => {
        registry.removeEventListener( ThermalEvents.READY, callback );
    }, [registry, callback] );


    return {
        registry,
        stopListening
    }

}