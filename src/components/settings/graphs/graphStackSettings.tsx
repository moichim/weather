"use client";

import { ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { useDisplayContext } from "@/state/displayContext";
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";

export const GraphStackSettings: React.FC = () => {

    const { set: graph } = useDisplayContext();

    return <ButtonGroup>


        <Tooltip
            content="Malé grafy"
            showArrow={true}
            color="foreground"
            placement="top"
        >
            <Button
                isIconOnly
                variant="bordered"
                onClick={() => graph.scale.setScale(0)}
            >
                S
            </Button>
        </Tooltip>
        <Tooltip
            content="Výchozí velikost grafů"
            showArrow={true}
            color="foreground"
            placement="top"
        >
            <Button
                isIconOnly
                variant="bordered"
                onClick={() => graph.scale.setScale(2)}
            >
                M
            </Button>
        </Tooltip>
        <Tooltip
            content="Velké grafy"
            showArrow={true}
            color="foreground"
            placement="top"
        >
            <Button
                isIconOnly
                variant="bordered"
                onClick={() => graph.scale.setScale(4)}
            >
                L
            </Button>
        </Tooltip>

        <div>{graph.scale.height}</div>


    </ButtonGroup>
}