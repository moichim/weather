"use client";

import { UseThermoInstanceType } from "@/thermal/hooks/useThermoInstanceObserver"
import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance"
import { CSSProperties, forwardRef, useMemo } from "react"
import { ThermalInstanceCursorMirror } from "./thermalCanvasCursorMirror"

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
        className="thermalCanvasContainer"
        style={style}
        ref={ref}
    >

        <div
            className="thermalCanvasWrapper"
        ></div>
        <ThermalInstanceCursorMirror
            {...props.observer}
            container={ref}
        />
    </div>
})

ThermalCanvasContainer.displayName = "ThermalCanvasContainer"

export {
    ThermalCanvasContainer
}
