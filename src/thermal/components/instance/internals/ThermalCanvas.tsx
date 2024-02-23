"use client";

import { UseThermoInstanceType } from "@/thermal/hooks/useThermoInstanceObserver"
import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance"
import { CSSProperties, forwardRef, useMemo } from "react"
import { cn } from "@nextui-org/react";

export type ThermalContainerProps = {
    originalSize?: boolean,
    containerStyles?: CSSProperties,
    containerClass?: string
}

type ThermalContainerPropsInternal = ThermalContainerProps & {
    file: ThermalFileInstance | undefined,
    observer: UseThermoInstanceType
}

/** The canvas is rendered inside this div. */
const ThermalCanvasContainer = forwardRef<
    HTMLDivElement,
    ThermalContainerPropsInternal
>(({
    originalSize = true,
    containerStyles = {} as CSSProperties,
    file = undefined,
    ...props
}, ref) => {

    const style = useMemo(() => {
        const css = containerStyles;
        if (file && originalSize === true)
            css.width = `${file.width}px`;
        css.position = "relative";
        return css;
    }, [originalSize, containerStyles, file]);

    return <div
        className={cn(
            "thermalCanvasContainer m-0 p-0",
            props.containerClass
        )}
        style={style}
        ref={ref}
    >
    </div>
})

ThermalCanvasContainer.displayName = "ThermalCanvasContainer"

export {
    ThermalCanvasContainer
}
