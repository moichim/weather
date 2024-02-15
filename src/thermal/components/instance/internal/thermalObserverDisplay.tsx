import { ThermalInstanceHook } from "@/thermal/hooks/useThermalInstance";

export const ThermalObserverDisplay: React.FC<ThermalInstanceHook["observer"]> = (props) => {
    return <div>x: {props.x}, y: {props.y}, value: {props.value}</div>
}