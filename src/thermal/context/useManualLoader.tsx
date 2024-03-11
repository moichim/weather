"use client"

import { useCallback, useEffect, useState } from "react";
import { ThermalFileRequest } from "../registry/ThermalRequest";
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { useGroupInstance } from "./useGroupInstance";
import { ThermalEvents } from "../registry/events";
import { ThermalGroup } from "../registry/ThermalGroup";

export const useManualLoader = (
    groupId: string,
    files: ThermalFileRequest[]
) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ instances, setInstances ] = useState<ThermalFileInstance[]>([]);

    const group = useGroupInstance( groupId );

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