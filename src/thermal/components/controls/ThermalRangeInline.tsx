"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useThermalMinmax } from "@/thermal/hooks/propertyListeners/useThermalMinmax";
import { useThermalPalette } from "@/thermal/hooks/propertyListeners/useThermalPalette";
import { useThermalRange } from "@/thermal/hooks/propertyListeners/useThermalRange";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { ThermalRangeType } from "@/thermal/registry/interfaces";
import { Skeleton, SliderValue, Spinner, Tooltip, cn } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { ThermalRangeSlider } from "./ThermalRangeSlider";
import { TemperatureControl } from "./textInputs/TemperatureControl";

type ThermalRangeProps = {
    object: ThermalRegistry | ThermalGroup | ThermalFileInstance,
    label?: React.ReactNode,
    imposeInitialRange?: ThermalRangeType,
    description?: React.ReactNode,
    className?: string,
    rangeOffset?: number,
    tooltip?: React.ReactNode,
    loaded: boolean
}

export const ThermalRangeInline: React.FC<ThermalRangeProps> = ({
    object,
    label = "Teplotní škála",
    imposeInitialRange = undefined,
    className = "w-full",
    rangeOffset = 0,
    ...props
}) => {


    const { range, imposeRange } = useThermalRange(object);
    const { minmax } = useThermalMinmax(object);
    const palette = useThermalPalette();

    const initialValue = useMemo(() => {

        if (imposeInitialRange) {

            const normalisedValue = [
                Math.min(imposeInitialRange.from, imposeInitialRange.to),
                Math.max(imposeInitialRange.from, imposeInitialRange.to)
            ] as [number, number];


            return normalisedValue;

        }

        return [
            range !== undefined ? range.from : -Infinity,
            range !== undefined ? range.to : Infinity
        ] as [number, number]

    }, [imposeInitialRange, range]);

    const [value, setValue] = useState<[number, number]>(initialValue);

    const [final, setFinal] = useState<[number, number]>(value);



    const onUserSlide = (data: SliderValue) => {
        if (Array.isArray(data))
            setValue(data as [number, number]);
    }

    const onUserSlideEnd = (data: SliderValue) => {
        if (Array.isArray(data))
            setFinal(data as [number, number]);
    }



    // Impose the local change to global context
    useEffect(() => {

        if (range !== undefined) {
            if (range.from !== final[0] || range.to !== final[1]) {
                imposeRange({ from: final[0], to: final[1] });
            }
            if (final[0] !== value[0] || final[1] !== value[1]) {
                setValue(final);
            }
        }


    }, [final]);


    // Reflect global changes to the local state
    useEffect(() => {

        if (range !== undefined) {

            if (
                range.from !== final[0]
                || range.to !== final[1]
            ) {
                setFinal([range.from, range.to]);
                setValue([range.from, range.to]);
            }

        }

    }, [range]);



    // Calculate the step based on minmax value
    const step = useMemo(() => {

        if (minmax === undefined)
            return -Infinity;

        return Math.round(minmax.max - minmax.min) / 50;

    }, [minmax]);




    // Conditional rendering


    if (minmax === undefined) {
        return <div className="flex-grow flex gap-4 items-center text-primary h-full">
            <Spinner size="sm" />
            <span>Zpracovávám teplotní škálu</span>
        </div>
    }

    if (range === undefined)
        return <div className="flex-grow flex gap-4 items-center text-primary h-full">
            <Spinner size="sm" />
            <span>Zpracovávám teplotní škálu</span>
        </div>

    if (props.loaded === false)
        return <div className="flex-grow flex gap-4 items-center text-primary h-full">
            <Spinner size="sm" />
            <span>Zpracovávám teplotní škálu</span>
        </div>

    return <div className={cn(className, "flex gap-4 w-full items-center thermal-scale-inline")}>
        <ThermalRangeSlider

            loaded={props.loaded}

            step={step}
            showSteps={step !== -Infinity}

            // Values
            minValue={Math.floor(minmax.min - rangeOffset)}
            maxValue={Math.ceil(minmax.max + rangeOffset)}
            value={value}

            // Events
            onChange={onUserSlide}
            onChangeEnd={onUserSlideEnd}


            // Appearance
            color="foreground"
            classNames={{
                base: "px-1 min-w-screen",
                mark: "bg-black",
                track: "bg-gray-400 h-6 cursor-pointer",
                filler: `thermal-scale-${palette.thermalPaletteSlug} cursor-pointer`,
                label: "text-xl"
            }}

        />

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
                imposeRange({ from: value, to: range.to });
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
                imposeRange({ from: range.from, to: value });
            }}

        />


    </div>





}