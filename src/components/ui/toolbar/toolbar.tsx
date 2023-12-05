import { Button, Tooltip, cn } from "@nextui-org/react"
import React, { Dispatch, SetStateAction } from "react"

export type ToolDefinitionType = {
    slug: number,
    name: string,
    tooltip: React.ReactNode,
    icon: React.FC,
    onActivate?: () => void,
    onDeactivate?: () => void,
}

type ToolbarProps = {
    tools: ToolDefinitionType[],
    tool: number,
    setTool: Dispatch<SetStateAction<number>>
}

type ToolPropsType = ToolDefinitionType & {
    setter: ToolbarProps["setTool"],
    active: ToolbarProps["tool"]
}

const Tool: React.FC<ToolPropsType> = props => {

    const isActive = props.active === props.slug;

    const Icon = props.icon;

    return <Tooltip
        showArrow={true}
        content={props.tooltip}
        placement="right"
        color="foreground"
    >
        <Button
            variant={props.active === props.slug ? "solid" : "bordered"}
            // color="foreground"
            isIconOnly
            onClick={() => {
                props.setter(props.slug);
                if (isActive)
                    props.onActivate && props.onActivate();
                else
                    props.onDeactivate && props.onDeactivate();
            }}
        >
            <Icon />
        </Button>
    </Tooltip>
}

export const Toolbar: React.FC<ToolbarProps> = props => {

    return <div className="shadow-2xl fixed left-5 top-5 bg-gray-100 rounded-lg p-3 flex flex-col gap-3">
        {props.tools.map(tool => <Tool key={tool.name} {...tool} setter={props.setTool} active={props.tool} />)}
    </div>

}