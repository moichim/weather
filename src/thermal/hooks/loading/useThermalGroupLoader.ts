"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useCallback, useEffect, useState } from "react";
import { useThermalGroup } from "../retrieval/useThernalGroup";
import { ThermalFileRequest } from "@/thermal/registry/ThermalRequest";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalEvents } from "@/thermal/registry/events";

export const useThermalGroupLoader = (
    groupId: string
) => {

    const group = useThermalGroup( groupId );

    const [loading, setLoading] = useState<boolean>(false);
    const [instances, setInstances] = useState<ThermalFileInstance[]>([]);

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

            const instances = target.getInstancesArray();

            setInstances(instances);

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