import { useGraphContext } from "@/state/graph/graphContext"
import { StackActions } from "@/state/graph/reducerInternals/actions"
import { GraphToolType, graphTools } from "@/state/graph/data/tools"
import { Button, Tooltip } from "@nextui-org/react"
import React, { useCallback, useMemo } from "react"


const Tool: React.FC<GraphToolType> = props => {

    const graph = useGraphContext();

    const isActive = useMemo(() => props.slug === graph.graphState.activeTool, [props.slug, graph.graphState.activeTool]);

    const dispatch = graph.graphDispatch;

    const Icon = useMemo(() => props.icon, [props.icon]);

    const onClick = useCallback(() => {

        dispatch(StackActions.selectTool(props.slug));

        if (isActive) {
            props.onActivate && props.onActivate(graph);
        } else {
            props.onDeactivate && props.onDeactivate(graph);
        }

    }, [dispatch, isActive, props.onActivate, props.onDeactivate, props.slug]);

    return <Tooltip
        showArrow={true}
        content={props.tooltip}
        placement="right"
        color="foreground"
    >
        <Button
            variant={"shadow"}
            isIconOnly
            onClick={onClick}
            className={isActive ? "bg-primary text-white" : "bg-foreground text-white"}
        >
            <Icon />
        </Button>
    </Tooltip>
}

export const Toolbar: React.FC = () => {

    return <div className="fixed left-5 top-[4.5rem] flex flex-col gap-3">
        {Object.values(graphTools).map(tool => <Tool
            key={tool.name}
            {...tool}
        />)}
    </div>

}