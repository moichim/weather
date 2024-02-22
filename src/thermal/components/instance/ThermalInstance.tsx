"use client";

import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance"
import { useRef } from "react";
import { ThermalCanvasContainer, ThermalContainerProps } from "./internals/ThermalCanvas";
import { useThermoInstanceObserver } from "@/thermal/hooks/useThermoInstanceObserver";
import { ThermalInstanceLogger } from "./internals/ThermalLogger";

type ThermalNinstanceProps = ThermalContainerProps & {
    file: ThermalFileInstance
}

export const ThermalInstance: React.FC<ThermalNinstanceProps> = props => {

    const containerReference = useRef<HTMLDivElement>(null);

    const observer = useThermoInstanceObserver( props.file, containerReference );

    return <div className="p-2 bg-gray-200 inline-block">
        <ThermalCanvasContainer 
            file={props.file} 
            ref={containerReference}
            observer={observer}
            containerStyles={props.containerStyles}
            originalSize={props.originalSize}
            containerClass={props.containerClass}
        ></ThermalCanvasContainer>
        <ThermalInstanceLogger {...observer}/>
    </div>

}