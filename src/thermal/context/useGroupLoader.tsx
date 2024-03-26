"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useCallback, useEffect, useState } from "react";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalFileRequest } from "../registry/ThermalRequest";
import { ThermalEvents } from "../registry/events";
import { useGroupInstance } from "./useGroupInstance";

/**
 * Handles files and instances of a group
 * 
 * Provides methods for batch loading of files. Exposes the list of instances in the group.
 */
export const useGroupLoader = (
    groupId: string
) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [instances, setInstances] = useState<ThermalFileInstance[]>([]);

    const group = useGroupInstance(groupId);

    const loadFiles = useCallback((
        files: ThermalFileRequest[]
    ) => {

        group.requestFiles(files);
        group.resolveQuery();

    }, [groupId]);

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


    // Mirror the instances
    useEffect(() => {

        const loadedListener = (event: Event) => {

            const target = event.target as ThermalGroup;

            const i = target.getInstancesArray();

            setInstances(i);

            // i.forEach( instance => instance.recieveActivationStatus( true ) );

        };

        group.addEventListener(ThermalEvents.GROUP_LOADING_FINISH, loadedListener);

    }, [group, instances, setInstances]);

    return {
        loading,
        loadFiles,
        instances,
        group
    }

}