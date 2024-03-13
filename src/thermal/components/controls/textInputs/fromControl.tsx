"use client";

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

type FromControlProps = InputProps & {
    label: string,
    step: number,
    minmax: ThermalMinmaxType,
    range: ThermalRangeType,
    onSetValid: (value: number) => void,
    doValidateFinalValue: (value: string) => false | number,
    getExternalValue: () => number,
}

export const FromControl: React.FC<FromControlProps> = props => {

    const [value, setValue] = useState(props.getExternalValue().toString());
    const [validValue, setValidValue] = useState<number>(props.getExternalValue());
    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    // Any chynges in the range applies to the current value
    useEffect(() => {

        console.log("range se změnila");

        const externalValue = props.getExternalValue();

        if (externalValue.toString() !== value) {
            setValue(externalValue.toString());
        }

    }, [props.range, setValue, props.getExternalValue]);

    // Any changes to the value applies to the valid value if they are valid
    useEffect(() => {

        console.log("value se změnila");


        const validatedValue = props.doValidateFinalValue(value);

        if (validatedValue !== false) {
            if (validatedValue !== validValue) {
                setValidValue(validatedValue);
                if (isInvalid === true) {
                    setIsInvalid(false);
                }
            }
        } else {
            if (isInvalid === false) {
                setIsInvalid(true);
            }
        }

    }, [value, setValidValue, setIsInvalid, isInvalid, props.doValidateFinalValue]);

    return <div className="flex items-center">
        <Input
            value={value}
            onValueChange={setValue}
            isInvalid={isInvalid}
            size="sm"
            label={props.label}
            endContent={"°C"}
            onKeyDown={event => {

                if (event.key === "Enter") {
                    if (!isInvalid)
                        props.onSetValid(validValue);
                }

                if (event.key === "Up") {
                    console.log("Up");
                }

            }}
            onBlur={event => {
                if (!isInvalid)
                    props.onSetValid(validValue);
                else {
                    setValue( validValue.toString() );
                }
            }}
        />
        {/*
        <div>
            <Button 
                aria-label={`Zvýšit minimální rozsah o ${props.step} stupňe`}
                isIconOnly
                size="sm"
            >+</Button>
            <Button 
                aria-label={`Snížit minimální rozsah o ${props.step} stupňe`}
                isIconOnly
                size="sm"
            >-</Button>
        </div>
        */}
    </div>
}