"use query";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance"
import { useEffect, useRef } from "react";
import { ThermalCanvasContainer } from "./ThermalContainer";

type ThermalInstanceProps = {
    instance: ThermalFileInstance
}

export const ThermalInstance: React.FC<ThermalInstanceProps> = props => {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (ref !== null) {
            if (ref.current) {
                props.instance.bind(ref.current);
                props.instance.initialise();
            }
        }

    }, [props.instance, ref]);

    return <div
            ref={ref}
            className="relative w-full xs:w-1/2 lg:w-1/3 p-0 m-0"
        ></div>
}