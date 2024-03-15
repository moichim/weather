"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { TimeEventsFactory } from "../reducerInternals/actions";
import { useTimeContext } from "../timeContext";

export const PresetDropdown: React.FC = () => {

    const { timeState, timeDispatch } = useTimeContext();

    let buttonLabel = "Předdefinovaný časový rozsah";

    if (timeState.currentPreset !== undefined) {
        buttonLabel = timeState.currentPreset.name;
    }


    return <Dropdown
        backdrop="blur"
    >

        <DropdownTrigger>
            <Button>{buttonLabel}</Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={key => {

                console.log(key);

                timeDispatch(TimeEventsFactory.activatePreset(key as string));

            }}
        >
            {Object.entries(timeState.presets).map(([key, preset]) => <DropdownItem key={key}>{preset.name}</DropdownItem>)}
        </DropdownMenu>

    </Dropdown>


}