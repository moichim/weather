"use client";

import { useGraphContext } from "@/state/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphInstanceScales, graphInstanceHeights } from "@/state/useGraphStack/storage";
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";

type GraphSize = {
    key: GraphInstanceScales,
    name: string,
    label: string,
    height: number
}

export const graphInstanceSizes: GraphSize[] = [
    {
        key: "sm",
        name: "S",
        label: "Malé grafy",
        height: graphInstanceHeights["sm"]
    },
    {
        key: "md",
        name: "M",
        label: "Střední grafy",
        height: graphInstanceHeights["md"]
    },
    {
        key: "lg",
        name: "L",
        label:"Velké grafy",
        height: graphInstanceHeights["lg"]
    },
    {
        key: "xl",
        name: "XL",
        label:"Extra velké grafy",
        height: graphInstanceHeights["xl"]
    },
    {
        key: "2xl",
        name: "XXL",
        label:"Obří grafy",
        height: graphInstanceHeights["2xl"]
    },
]

export const GraphStackSettings: React.FC = () => {

    const { stack } = useGraphContext();

    const activeScale = Object.values( stack.state.graphs ).reduce( (
        state:undefined|boolean|GraphInstanceScales, current
    ) => {
        if ( state === undefined ) return current.scale;
        if ( state === false ) return false;
        if ( current.scale === state ) return state;
        return false;
    }, undefined );

    return <ButtonGroup>

        {graphInstanceSizes.map(size => {

            return <Tooltip
                content={size.label}
                showArrow
                color="foreground"
            >

                <Button
                    isIconOnly
                    variant="bordered"
                    className={ size.key === activeScale ? "bg-gray-100" : "bg-white" }
                    onClick={() => stack.dispatch( StackActions.setHeights( size.key ) )}
                >
                    {size.name}
                </Button>

            </Tooltip>

        })}

    </ButtonGroup>
}