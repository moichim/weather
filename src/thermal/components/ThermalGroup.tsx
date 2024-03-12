"use client";

import { useEffect } from "react";
import { ThermalFileRequest } from "../registry/ThermalRequest";
import { useGroupListener } from "../context/useGroupListener";
import { useGroupLoader } from "../context/useGroupLoader";
import { ThermalInstance } from "./instance/ThermalInstance";
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
 */
export const ThermalGroup: React.FC<ThermalGroupProps> = props => {

    const loader = useGroupLoader(props.groupId);

    useEffect(() => {

        loader.loadFiles(props.files);

    }, [props.files]);

    const listener = useGroupListener(props.groupId);



    return <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="rounded-xl bg-white shadow-xl">

            <div style={{ minHeight: "10rem" }} className="p-4">
                <h2 className="font-bold text-xl">{props.name}</h2>

                {props.description && <p className="py-2">{props.description}</p>}

                {listener.minmax && <div className="text-small text-gray-500">
                    <p>Minimum: {listener.minmax.min.toFixed(3)} °C</p>
                    <p>Maximum: {listener.minmax.max.toFixed(3)} °C</p>
                </div>}

            </div>

            {loader.instances.length > 0 && <>
                <div className="relative flex flex-wrap">
                    {loader.instances.map(instance => {
                        return <ThermalInstance instance={instance} key={instance.id} />
                    })}
                </div>
            </>}

        </div>
    </div>

}