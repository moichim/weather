"use client";

import { ThermalContainerStates, ThermalObjectContainer } from "@/thermal/registry/abstractions/ThermalObjectContainer";
import { ContainerLoadingEvent, ThermalEvents } from "@/thermal/registry/events";
import { useEffect, useState } from "react";

export const useThermalLoadingState = (
    target: ThermalObjectContainer
) => {

    const [loadingState, setLoading] = useState<ThermalContainerStates>( target.loadingState );

    useEffect( () => {
        console.info( "Loading state", loadingState, "of", target );
    }, [loadingState] );

    // Listen for the loading events and mirrir them to local state
    useEffect( () => {

        const stateListener = ( evt: Event ) => {
            const event = evt as ContainerLoadingEvent;
            setLoading( event.detail.state )
        }

        target.addEventListener( 
            ThermalEvents.CONTAINER_LOADING_STATE_CHANGED, 
            stateListener 
        );

        return () => target.removeEventListener(
            ThermalEvents.CONTAINER_LOADING_STATE_CHANGED,
            stateListener
        );

    }, [target] );


    return {
        target,
        loadingState
    }

}
