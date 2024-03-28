import { useRegistryContext } from "@/thermal/context/RegistryContext";
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalContainerStates } from "@/thermal/registry/abstractions/ThermalObjectContainer";
import { ContainerLoadingEvent, ThermalEvents } from "@/thermal/registry/events";
import { ThermalMinmaxOrUndefined } from "@/thermal/registry/interfaces";
import { useEffect, useMemo, useState } from "react";
import { useThermalLoadingState } from "../propertyListeners/useThermalLoadingState";

export const useThermalGroupInstance = (
    groupId: string
) => {

    const {registry, loadingState: globalLoadingState} = useRegistryContext();

    const group = registry.addOrGetGroup( groupId );

    const hash = useMemo(() => {
        return group.hash;
    }, [group] );

    const { loadingState } = useThermalLoadingState( group );

    const [instances, setInstances] = useState<ThermalFileInstance[]>( group.getInstancesArray() );

    const [minmax, setMinmax] = useState<ThermalMinmaxOrUndefined>(  );

    useEffect( () => {
        setMinmax( group.minmax );
        // setInstances( group.getInstancesArray() );
    }, [loadingState, group] );

    useEffect( () => {
        console.log( "Hodnota se změnila:", hash, groupId, minmax, instances, loadingState, globalLoadingState );
    }, [minmax, instances, globalLoadingState] );

    useEffect( () => {

        const listener = ( evt: Event) => {

            const event = evt as ContainerLoadingEvent;

            if ( event.detail.state === ThermalContainerStates.LOADED ) {

                const g = event.detail.container as ThermalGroup;

                console.log( "Skupina byla načtena", groupId, g.getInstancesArray() );

                setInstances( g.getInstancesArray() );

            } else if (
                event.detail.state === ThermalContainerStates.LOADING
                || event.detail.state === ThermalContainerStates.EMPTY
            ) {
                setInstances( [] );
            }

        }

        group.addEventListener( ThermalEvents.CONTAINER_LOADING_STATE_CHANGED, listener );

        return () => group.removeEventListener( ThermalEvents.CONTAINER_LOADING_STATE_CHANGED, listener );

    }, [ group, hash ] );


    return {
        loadingState,
        minmax,
        instances,
        group
    }

}