"use client";

import { useManualLoader } from "@/thermal/context/useManualLoader";
import { ThermalFileRequest } from "@/thermal/registry/ThermalRequest";
import { ThermalInstance } from "../instance/ThermalInstance";
import { useEffect } from "react";
import { useRegistryListener } from "@/thermal/context/useRegistryListener";
import { ThermalScale } from "../registry/ThermalScale";
import { Skeleton, SliderValue, cn } from "@nextui-org/react";
import { OpacityScale } from "../registry/OpacityScale";

export type CustomisedThermalFileRequest = ThermalFileRequest & {
    className?: string
}

type ManualGroupProps = {
    id: string,
    files: CustomisedThermalFileRequest[]
}

const getInstanceClasses = (files: CustomisedThermalFileRequest[], url: string) => {
    return files.find(file => file.thermalUrl == url)?.className;
}

export const ManualGroup: React.FC<ManualGroupProps> = props => {

    const loader = useManualLoader(props.id, props.files);

    const listener = useRegistryListener();

    const onSliderChange = (value: SliderValue) => {
        if (Array.isArray(value)) {
            listener.setRange({ from: value[0], to: value[1] });
        }
    }

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
                ? loader.instances.map(instance => <ThermalInstance instance={instance} key={instance.url} className={getInstanceClasses(props.files, instance.url)} />)
                : props.files.map(file => <Skeleton
                    className={cn(file.className, "h-1/3")}
                />)
            }
        </div>

        {(listener.minmax !== undefined && listener.range !== undefined && listener.ready) && <div className="text-center pt-4">
            <ThermalScale
                step={Math.round((listener.minmax.max - listener.minmax.min) / 50)}
                min={listener.minmax.min}
                max={listener.minmax.max}
                from={listener.range.from}
                to={listener.range.to}
                onChange={onSliderChange}
                scaleOffset={10}
            />
        </div>
        }
    </>

}