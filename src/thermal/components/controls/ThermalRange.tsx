import { useThermalMinmax } from "@/thermal/hooks/propertyListeners/useThermalMinmax";
import { useThermalRange } from "@/thermal/hooks/propertyListeners/useThermalRange"
import { useThermalRegistry } from "@/thermal/hooks/retrieval/useThermalRegistry"
import { Input, Skeleton, SliderValue, Tooltip } from "@nextui-org/react";
import { ThermalScale } from "../registry/ThermalScale";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ThermalRangeSlider } from "./ThermalRangeSlider";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalRangeType } from "@/thermal/registry/interfaces";
import { SliuderValueInput } from "./SliderValueInput";

type ThermalRangeProps = {
    object: ThermalRegistry | ThermalGroup | ThermalFileInstance,
    label?: React.ReactNode,
    imposeInitialRange?: ThermalRangeType,
    description?: React.ReactNode,
    className?: string,
    rangeOffset?: number,
    tooltip?: React.ReactNode
}

export const ThermalRange: React.FC<ThermalRangeProps> = ({
    object,
    label = "Teplotní škála",
    imposeInitialRange = undefined,
    className = "w-full",
    rangeOffset = 0,
    ...props
}) => {


    const { range, imposeRange } = useThermalRange(object);
    const { minmax } = useThermalMinmax(object);

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

        if (range !== undefined)
            if (range.from !== final[0] || range.to !== final[1]) {
                imposeRange({ from: final[0], to: final[1] });
                setValue(final);
            }

    }, [final]);



    // Calculate the step based on minmax value
    const step = useMemo(() => {

        if (minmax === undefined)
            return -Infinity;

        return Math.round(minmax.max - minmax.min) / 50;

    }, [minmax]);



    // Conditional rendering



    if (minmax === undefined) {
        return <Skeleton />
    }

    if (range === undefined)
        return <Skeleton />

    return <Tooltip
        content={props.tooltip}
        placement="bottom"
        isDisabled={props.tooltip === undefined}
    >
        <div className={className}>
            <ThermalRangeSlider

                label={label}

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
                    filler: "thermal-scale-gradient cursor-pointer",
                    label: "text-xl"
                }}


                renderValue={({ children, ...props }) => (
                    <div className="flex gap-3">

                        <SliuderValueInput
                            {...props}
                            startContent="od"
                            value={final[0]}
                            onChange={(e) => {

                                const event = e as ChangeEvent<HTMLInputElement>

                                setFinal([parseFloat(event.target.value), final[1]]);
                                
                            }}
                            tooltipContent="Minimální zobrazená teplota"
                        />

                        <SliuderValueInput
                            {...props}
                            startContent="do"
                            value={final[1]}
                            onChange={(e) => {

                                // const v = e.target.value;

                                // setFinal([parseFloat(v), final[1]]);
                            }}
                            tooltipContent="Maximální zobrazená teplota"
                        />


                    </div>
                )}


            />

            {props.description && <div className="text-sm text-center text-gray-500 pt-4">{props.description}</div>}

        </div>
    </Tooltip>





}