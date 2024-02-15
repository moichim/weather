import ThermalFile from "@/thermal/reader/thermalFile"
import { CSSProperties, RefObject, forwardRef, useMemo } from "react"

export type ThermalContainerProps = {
    originalSize?: boolean,
    containerStyles?: CSSProperties,
    containerClass?: string
}

type ThermalContainerPropsInternal = ThermalContainerProps & {
    ref: RefObject<HTMLDivElement>,
    file: ThermalFile | undefined
}

/** The canvas is rendered inside this div. */
const ThermalCanvasContainer = forwardRef<
    HTMLDivElement, 
    ThermalContainerPropsInternal
>( ( {
    originalSize = true,
    containerStyles = {} as CSSProperties,
    file = undefined,
    ...props 
}, ref ) => {

    const style = useMemo(() => {
        const css = containerStyles;
        if (file && originalSize === true)
            css.width = `${file.width}px`;
        css.position = "relative";
        return css;
    }, [originalSize, containerStyles, file]);

    return <div
        ref={ref}
        style={style}
    ></div>
})

ThermalCanvasContainer.displayName = "ThermalCanvasContainer"

export {
    ThermalCanvasContainer
};