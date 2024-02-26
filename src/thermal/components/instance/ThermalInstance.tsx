"use client";

import { useThermoInstanceObserver } from "@/thermal/hooks/useThermoInstanceObserver";
import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance";
import { useRef } from "react";
import { ThermalCanvasContainer, ThermalContainerProps } from "./internals/ThermalCanvas";

type ThermalNinstanceProps = ThermalContainerProps & {
    file: ThermalFileInstance
}

export const ThermalInstance: React.FC<ThermalNinstanceProps> = props => {

    const containerReference = useRef<HTMLDivElement>(null);

    const observer = useThermoInstanceObserver(props.file, containerReference);

    return <>
        <ThermalCanvasContainer
            file={props.file}
            ref={containerReference}
            observer={observer}
            containerStyles={props.containerStyles}
            originalSize={props.originalSize}
            containerClass={props.containerClass}
        ></ThermalCanvasContainer>
    </>

}