"use client";

import { UseThermoInstanceType } from "@/thermal/hooks/useThermoInstanceObserver";
import { ForwardedRef, RefObject } from "react";

export type ThermalInstanceCursorMirrorProps = UseThermoInstanceType & {
    container: ForwardedRef<HTMLDivElement>
}

export const ThermalInstanceCursorMirror: React.FC<ThermalInstanceCursorMirrorProps> = props => {

    if (props.y === undefined || props.x === undefined || props.value === undefined) {
        return <></>
    }

    const showNumber = true;

    return <div
        className="thermalCanvasCursorMirror"
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
        }}
    >
        {props.x !== undefined && <div
            className="mirrorX"
            style={{
                width: "1px",
                height: "100%",
                backgroundColor: "white",
                top: 0,
                opacity: .5,
                left: props.mirrorX,
                content: "",
                position: "absolute"
            }}
        ></div>}
        {props.y !== undefined && <div
            className="mirrorY"
            style={{
                width: "100%",
                height: "1px",
                backgroundColor: "white",
                opacity: .5,
                top: props.mirrorY,
                left: 0,
                content: "",
                position: "absolute"
            }}
        ></div>}
        {(showNumber) && <div
            className="mirrorValue"
            style={{

                position: "absolute",
                top: props.mirrorY,
                left: props.mirrorX,
                width: 0,
                height: 0,
                background: "yellow"

            }}
        >
            <div
                style={{
                    position: "absolute",
                    padding: "5px 7px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    borderRadius: "5px",
                    whiteSpace: "nowrap",
                    ...props.labelStyle
                }}
            >
                {props.value.toFixed(2)} °C
            </div>
        </div>
        }
    </div>

}