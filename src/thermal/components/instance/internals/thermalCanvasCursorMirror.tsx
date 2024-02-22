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
                backdropFilter: "invert(100)",
                top: 0,
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
                backdropFilter: "invert(100)",
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
                    padding: "2px 3px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    borderRadius: "5px",
                    whiteSpace: "nowrap",
                    fontSize: "small",
                    ...props.labelStyle
                }}
            >
                {props.value.toFixed(2)} °C
            </div>
        </div>
        }
    </div>

}