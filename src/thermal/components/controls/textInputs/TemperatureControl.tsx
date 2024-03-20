"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useThermalMinmax } from "@/thermal/hooks/propertyListeners/useThermalMinmax";
import { useThermalRange } from "@/thermal/hooks/propertyListeners/useThermalRange";
import { useThermalRegistry } from "@/thermal/hooks/retrieval/useThermalRegistry";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { ThermalMinmaxOrUndefined, ThermalMinmaxType, ThermalRangeOrUndefined, ThermalRangeType } from "@/thermal/registry/interfaces";
import { Button, Input, InputProps } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { isUndefined } from "util";
import { validate } from "uuid";

type FromControlProps = InputProps & {
    label: string,
    step: number,
    minmax: ThermalMinmaxType,
    range: ThermalRangeType,
    currentValue?: number,
    onSetValid: (value: number) => void,
    doValidateFinalValue: (value: string) => false | number,
}

export const TemperatureControl: React.FC<FromControlProps> = props => {

    const [value, setValue] = useState<number | undefined>();

    // Any chynges in the range applies to the current value
    useEffect(() => {

        if (props.currentValue)
            setValue(parseFloat(props.currentValue.toFixed(3)));

    }, [props.range, setValue, props.currentValue]);


    return <div className="flex items-center justify-stretch">
        <Button
            isDisabled={value !== undefined
                ? (value - props.step) < props.minmax.min
                : true}
            onClick={() => {
                if (value !== undefined)
                    if ((value - props.step) > props.minmax.min)
                        props.onSetValid(value - props.step);
            }}
            isIconOnly
            className="rounded-e-none py-6"
        >
            <ArrowLeftIcon />
        </Button>

        <div className="bg-white px-3 py-1 min-w-36">
            <div className="text-sm text-primary">{props.label}</div>
            <div>{value} °C</div>
        </div>

        <Button
            isDisabled={value !== undefined
                ? (value + props.step) > props.minmax.max
                : true}
            onClick={() => {
                if (value !== undefined)
                    if ((value + props.step) < props.minmax.max)
                        props.onSetValid(value + props.step);
            }}
            isIconOnly
            className="rounded-s-none py-6"
        >
            <ArrowRightIcon />
        </Button>

    </div>
}