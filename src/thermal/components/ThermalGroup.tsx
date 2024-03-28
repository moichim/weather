"use client";

import { useEffect } from "react";
import { useThermalGroupInstance } from "../hooks/retrieval/useThermalGroupinstance";
import { ThermalFileRequest } from "../registry/ThermalRequest";
import { ThermalInstance } from "./instance/ThermalInstance";
import { ThermalContainerStates } from "../registry/abstractions/ThermalObjectContainer";
import { Spinner } from "@nextui-org/react";

type ThermalGroupProps = {
    groupId: string,
    name: string,
    description?: string,
    files: ThermalFileRequest[]
}

/** 
 * Handles a single troup of images. 
 * 
 * Instantiated once the folder is loaded in `Project Controller`. Initialises the loading of files.
 * @deprecated
 */
export const ThermalGroup: React.FC<ThermalGroupProps> = props => {


    const { instances, loadingState, minmax, group } = useThermalGroupInstance(props.groupId);

    useEffect(() => {
        if (loadingState === ThermalContainerStates.LOADED) {
            group.recieveActivationStatus(true);
        }
    }, []);



    return <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="rounded-xl bg-white shadow-xl">

            <div style={{ minHeight: "10rem" }} className="p-4">
                <h2 className="font-bold text-xl">{props.name}</h2>

                {props.description && <p className="py-2">{props.description}</p>}

                {(loadingState !== ThermalContainerStates.LOADED) && <div className="w-full flex gap-4 items-center text-primary-500">
                        <Spinner /> Zpracovávám data
                </div>
                }

                {(loadingState === ThermalContainerStates.LOADED && minmax) && <div className="text-small text-gray-500">
                    <p>Minimum: {minmax.min.toFixed(3)} °C</p>
                    <p>Maximum: {minmax.max.toFixed(3)} °C</p>
                </div>


                }

            </div>

            {(instances.length > 0 && loadingState === ThermalContainerStates.LOADED ) && <>
                <div className="relative flex flex-wrap -ms-[1px] -me-[3px] md:-me-[3px] lg:-me-[7px]">
                    {instances.map(instance => {
                        return <ThermalInstance instance={instance} key={instance.id} />
                    })}
                </div>
            </>}

        </div>
    </div>

}