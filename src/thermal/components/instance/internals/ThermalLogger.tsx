"use client";

import { UseThermoInstanceType } from "@/thermal/hooks/useThermoInstanceObserver";

export const ThermalInstanceLogger: React.FC<UseThermoInstanceType> = props => {

    return <div>
        <div>{props.hover ? "Hover" : "Inactive"}</div>
        x: {props.x},
        y: {props.y},
        <div>value: {props.value ? props.value.toFixed(3) : undefined}</div>
        <div>mirrorX: {props.mirrorX}, mirrorY: {props.mirrorY}</div>
    </div>

}