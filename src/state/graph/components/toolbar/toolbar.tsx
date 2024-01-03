import { useGraphContext } from "@/state/graph/graphContext"
import { StackActions } from "@/state/graph/reducerInternals/actions"
import { GraphToolType, graphTools } from "@/state/graph/data/tools"
import { Button, Tooltip, cn } from "@nextui-org/react"
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
            id={`${props.slug}Tool`}
            variant={"shadow"}
            isIconOnly
            onClick={onClick}
            className={cn(
                "bg-foreground text-background shadow-xl",
                isActive ? "bg-opacity-90" : "bg-opacity-50"
            ) }
        >
            <Icon />
        </Button>
    </Tooltip>
}

export const Toolbar: React.FC = () => {

    return <div className="fixed left-5 flex flex-col gap-1" style={{top: "4rem"}}>
        {Object.values(graphTools).map(tool => <Tool
            key={tool.name}
            {...tool}
        />)}
    </div>

}