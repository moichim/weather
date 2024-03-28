"use client";

import { ThermalRegistry, ThermalStatistics } from "@/thermal/registry/ThermalRegistry";
import { ThermalContainerStates } from "@/thermal/registry/abstractions/ThermalObjectContainer";
import { ContainerLoadingEvent, ThermalEvents } from "@/thermal/registry/events";
import { useEffect, useState } from "react";

export const useThermalHistogram = (
    registry: ThermalRegistry
) => {

    const [ histogram, setHistogram ] = useState<ThermalStatistics[]>();


    useEffect( () => {

        const listener = ( evt: Event) => {

            const event = evt as ContainerLoadingEvent;

            if ( event.detail.state === ThermalContainerStates.LOADED ) {

                const g = event.detail.container as ThermalRegistry;

                setHistogram( g._getHistorgramFromAllGroups() );
            }

        }

        registry.addEventListener( ThermalEvents.CONTAINER_LOADING_STATE_CHANGED, listener );

        return () => registry.removeEventListener( ThermalEvents.CONTAINER_LOADING_STATE_CHANGED, listener );

    }, [ registry ] );


    return {
        histogram
    }

}
