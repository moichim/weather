"use client";

import { useRegistryListener } from "@/thermal/context/useRegistryListener";
import { ThermalScale } from "./ThermalScale";
import { SliderValue } from "@nextui-org/react";

export const ThermalScaleGlobal: React.FC = () => {

    const listener = useRegistryListener();

    const onSliderChange = (value: SliderValue) => {
        if (Array.isArray(value)) {
            listener.setRange({ from: value[0], to: value[1] });
        }
    }

    console.log( listener );

    return <>
        {(listener.minmax !== undefined && listener.range !== undefined && listener.ready) &&
            <ThermalScale
                step={Math.round((listener.minmax.max - listener.minmax.min) / 50)}
                min={listener.minmax.min}
                max={listener.minmax.max}
                from={listener.range.from}
                to={listener.range.to}
                onChange={onSliderChange}
                scaleOffset={10}
            />
        }
    </>
}