import { ThermalInstanceHook } from "@/thermal/hooks/useThermalInstance";

export const ThermalObserverDisplay: React.FC<ThermalInstanceHook["observer"]> = (props) => {

    if (!props.x || !props.y || !props.value) {
        return <></>
    }
    return <div className={"text-small"}>{props.value.toFixed(3)} °C</div>
}