import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";

type DateDropdownTypes = {
    options: string[],
    value: string,
    onAction: (selection: string) => void,
    label: string
}

export const DateDropdown: React.FC<DateDropdownTypes> = props => {

    return <Dropdown>
        <DropdownTrigger>
            <Button variant="bordered">{props.value}</Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label={props.label}
            onAction={ (selection) => props.onAction( selection as any ) }
        >
            {props.options.map( item => {
                return <DropdownItem key={item}>{item}</DropdownItem>
            } )}
        </DropdownMenu>
    </Dropdown>

}