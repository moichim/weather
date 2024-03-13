"use client"

import { useCallback, useEffect, useState } from "react";
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { useThermalGroup } from "../hooks/retrieval/useThernalGroup";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalFileRequest } from "../registry/ThermalRequest";
import { ThermalEvents } from "../registry/events";

export const useManualLoader = (
    groupId: string,
    files: ThermalFileRequest[]
) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ instances, setInstances ] = useState<ThermalFileInstance[]>([]);

    const group = useThermalGroup( groupId );

    const load = useCallback( () => {

        group.requestFiles( files );
        group.resolveQuery();

    }, [group, files] );

    // Mirrir the loading state
    useEffect(() => {

        const loadingFinish = () => {
            setLoading(false);
        }

        group.addEventListener(ThermalEvents.GROUP_LOADING_FINISH, loadingFinish);

        const loadingStart = () => {
            setLoading(true);
        }

        group.addEventListener(ThermalEvents.GROUP_LOADING_START, loadingStart);

        return () => {
            group.removeEventListener(ThermalEvents.GROUP_LOADING_FINISH, loadingFinish);
            group.removeEventListener(ThermalEvents.GROUP_LOADING_START, loadingStart);
        }

    }, [group, setLoading]);


    useEffect( () => {


        const loadedListener = (event: Event) => {

            const target = event.target as ThermalGroup;

            const instances = target.getInstancesArray();

            setInstances(instances);

        };

        group.addEventListener(ThermalEvents.GROUP_LOADING_FINISH, loadedListener);


    }, [ group, instances, setInstances ] );


    // Activate the group once it is loaded
    useEffect( () => {

        if ( instances.length > 0 ) {
            group.recieveActivationStatus( true );
        }

    }, [ instances ] );

    return {
        load,
        loading,
        instances,
        group
    }

}