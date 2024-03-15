"use client";

import { Radio, RadioGroup, TabsProps } from "@nextui-org/react";
import { TimeEventsFactory, TimePeriod } from "../reducerInternals/actions";
import { useTimeContext } from "../timeContext";

type ModificationModeSwitchProps = TabsProps;

export const ModificationModeSwitch: React.FC<ModificationModeSwitchProps> = () => {

    const { timeState, timeDispatch } = useTimeContext();

    return <div>
        <p className="pb-3">Šipkami přidáváte či odebíráte</p>
        <RadioGroup
            aria-label="O kolik bude měněn časový rozsah?"
            value={timeState.modificationMode}
            onValueChange={value => {
                console.log(value);
                timeDispatch(TimeEventsFactory.setModificationMode(value as TimePeriod))
            }}
            size="sm"
        >
            {Object.entries(TimePeriod).map(([key, value]) => {

                return <Radio key={key} value={value.toString()} title={value.toString()}>{value.toString()}</Radio>

            })}

        </RadioGroup>

    </div>

}