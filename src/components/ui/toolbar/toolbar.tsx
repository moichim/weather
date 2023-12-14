import { useGraphContext } from "@/state/graphStackContext"
import { StackActions } from "@/state/useGraphStack/actions"
import { GraphToolType, graphTools } from "@/state/useGraphStack/tools"
import { Button, Tooltip } from "@nextui-org/react"
import React, { useCallback, useMemo } from "react"


const Tool: React.FC<GraphToolType> = props => {

    const hook = useGraphContext();

    const isActive = useMemo(() => props.slug === hook.stack.state.activeTool, [props.slug, hook.stack.state.activeTool]);

    const dispatch = hook.stack.dispatch;

    const Icon = useMemo(() => props.icon, [props.icon]);

    const onClick = useCallback(() => {

        dispatch(StackActions.selectTool(props.slug));

        if (isActive) {
            props.onActivate && props.onActivate(hook.stack);
        } else {
            props.onDeactivate && props.onDeactivate(hook.stack);
        }

    }, [dispatch, isActive, props.onActivate, props.onDeactivate, props.slug]);

    return <Tooltip
        showArrow={true}
        content={props.tooltip}
        placement="right"
        color="foreground"
    >
        <Button
            variant={isActive ? "solid" : "bordered"}
            isIconOnly
            onClick={onClick}
        >
            <Icon />
        </Button>
    </Tooltip>
}

export const Toolbar: React.FC = () => {

    return <div className="shadow-2xl fixed left-5 top-5 bg-white rounded-lg p-3 flex flex-col gap-3">
        {Object.values(graphTools).map(tool => <Tool
            key={tool.name}
            {...tool}
        />)}
    </div>

}