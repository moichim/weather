"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { cn } from "@nextui-org/react";
import { ThermalRangeSlider } from "./ThermalRangeSlider";

type ThermalRangeProps = {
    registry: ThermalRegistry,
    label?: React.ReactNode,
    description?: React.ReactNode,
    className?: string,
    rangeOffset?: number,
    tooltip?: React.ReactNode,
    loaded: boolean
}

export const ThermalRangeInline: React.FC<ThermalRangeProps> = ({
    registry,
    label = "Teplotní škála",
    className = "w-full",
    rangeOffset = 0,
    ...props
}) => {

    return <div className={cn(className, "flex gap-4 w-full items-center thermal-scale-inline")}>
        <ThermalRangeSlider
            registry={registry}
            label={label}
            rangeOffset={rangeOffset}
        />

        {/**
         

        <TemperatureControl
            step={step}
            range={range}
            minmax={minmax}
            label="od"
            className="md:hidden"
            currentValue={range.from}
            doValidateFinalValue={value => {

                const parsedValue = parseFloat(value);

                if (isNaN(parsedValue)) {
                    return false;
                }

                if (parsedValue < minmax.min) {
                    return false
                }

                return parsedValue;
            }}
            onSetValid={value => {
                imposeGlobalRange({ from: value, to: range.to });
            }}

        />

        <TemperatureControl
            step={step}
            range={range}
            minmax={minmax}
            label="do"
            currentValue={range.to}
            className="md:hidden"
            doValidateFinalValue={value => {

                const parsedValue = parseFloat(value);

                if (isNaN(parsedValue)) {
                    return false;
                }

                if (parsedValue > minmax.max) {
                    return false
                }

                return parsedValue;
            }}
            onSetValid={value => {
                imposeGlobalRange({ from: range.from, to: value });
            }}

        />

         */}


    </div>





}