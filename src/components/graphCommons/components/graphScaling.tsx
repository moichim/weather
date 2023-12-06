import { ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { Button, Tooltip } from "@nextui-org/react";
import { PropertyGraphWithStateType } from "../useGraph";

export const GraphScaling: React.FC<PropertyGraphWithStateType> = props => {

    if (props.scale.scaleUp === undefined && props.scale.scaleDown === undefined)
        return <></>

    return <>
        <Tooltip
            isDisabled={props.scale.scaleUp === undefined}
            content="Zvětšit graf"
            showArrow={true}
            color="foreground"
            placement="bottom"
        >
            <Button
                isIconOnly
                variant="light"
                className="bg-white"
                onClick={props.scale.scaleUp}
                isDisabled={props.scale.scaleUp === undefined}
            >
                <ZoomInIcon />
            </Button>
        </Tooltip>
        <Tooltip
            isDisabled={props.scale.scaleDown === undefined}
            content="Zmenšit graf"
            showArrow={true}
            color="foreground"
            placement="bottom"
        >
            <Button
                isIconOnly
                variant="light"
                className="bg-white"
                onClick={props.scale.scaleDown}
                isDisabled={props.scale.scaleDown === undefined}
            >
                <ZoomOutIcon />
            </Button>
        </Tooltip>
    </>

}