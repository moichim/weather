"use client";

import { useManualLoader } from "@/thermal/context/useManualLoader";
import { useRegistryListener } from "@/thermal/context/useRegistryListener";
import { ThermalFileRequest } from "@/thermal/registry/ThermalRequest";
import { Skeleton, cn } from "@nextui-org/react";
import { useEffect } from "react";
import { ThermalRange } from "../controls/ThermalRange";
import { ThermalInstance } from "../instance/ThermalInstance";

export type CustomisedThermalFileRequest = ThermalFileRequest & {
    className?: string
}

type ManualGroupProps = {
    id: string,
    files: CustomisedThermalFileRequest[]
}



export const ManualGroup: React.FC<ManualGroupProps> = props => {

    const getInstanceClasses = (files: CustomisedThermalFileRequest[], url: string) => {
        return files.find(file => file.thermalUrl == url)?.className;
    }

    const loader = useManualLoader(props.id, props.files);

    const listener = useRegistryListener();

    useEffect(() => {
        loader.load();
    }, []);

    useEffect(() => {
        if (loader.instances.length > 0) {
            loader.group.registry.imposeRange({ from: -13, to: 27 });
            loader.instances.forEach(instance => instance.emitsDetail = false);
        }
    }, [loader.instances]);

    return <>
        <style>
            {`.thermal-scale-gradient {background-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(10,12,77,1) 30%, rgba(86,20,101,1) 49%, rgba(255,0,0,1) 64%, rgba(249,255,0,1) 84%, rgba(255,255,255,1) 100%)}`}
        </style>
        <div className="relative flex flex-wrap w-full">
            {loader.instances.length > 0
                ? loader.instances.map(instance => <ThermalInstance key={instance.url} instance={instance} className={getInstanceClasses(props.files, instance.url)} />)
                : props.files.map(file => <Skeleton key={file.thermalUrl}
                    className={cn(file.className, "h-1/3")}
                />)
            }
        </div>

        <ThermalRange object={ loader.group } imposeInitialRange={{from:-17, to: 13}} rangeOffset={5}/>
    </>

}