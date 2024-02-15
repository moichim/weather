"use client";

import { useThermalInstance } from "@/thermal/hooks/useThermalInstance";
import { CSSProperties, useMemo, useRef } from "react";
import { ThermalCanvasContainer, ThermalContainerProps } from "./internal/thermalCanvasContainer";
import { ThermalObserverDisplay } from "./internal/thermalObserverDisplay";

type ThermalImage = ThermalContainerProps & {
    url: string,
}

export const ThermalImage: React.FC<ThermalImage> = ({
    originalSize = true,
    containerStyles = {} as CSSProperties,
    ...props
}) => {

    const containerReference = useRef<HTMLDivElement>(null);

    const { file, observer } = useThermalInstance( props.url, containerReference );

    return <div>

        <ThermalCanvasContainer ref={containerReference} file={file} originalSize={originalSize} containerStyles={containerStyles}/>
        <ThermalObserverDisplay {...observer}/>
    </div>

}