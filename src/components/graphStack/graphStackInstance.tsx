import { ButtonGroup, cn } from "@nextui-org/react";
import { GraphChart } from "../graphCommons/components/graphChart";
import { GraphHeader } from "../graphCommons/components/graphHeader";
import { GraphSettings } from "../graphCommons/components/graphSettings";
import { PropertyGraphPropsType, useGraphInstance } from "../graphCommons/useGraph";
import { GraphScaling } from "../graphCommons/components/graphScaling";
import { useDisplayContext } from "@/state/displayContext";
import { useEffect, useState } from "react";
import { GraphReferenceTable } from "../graphCommons/components/graphReferenceTable";

export const GraphStackInstance: React.FC<PropertyGraphPropsType & {
    index: number
}> = props => {

    const graph = useGraphInstance(props.prop);
    const {set: config} = useDisplayContext();

    const bgClass = props.index % 2 === 0 ? "bg-white" : "bg-gray-100";

    useEffect( () => {
        // graph.scale.setScale( config.scale.height );
        
    }, [config.scale.height] );



    return <div className={cn("flex w-full gap-2 p-3")}>

        <div className="w-1/6 flex items-end justify-start flex-col gap-3">
            <div>
                <GraphHeader prop={props.prop} {...graph} />
            </div>
            
            <ButtonGroup size="sm" className="shadow-xl">
                <GraphSettings prop={props.prop} {...graph} />
                <GraphScaling prop={props.prop} {...graph} />
            </ButtonGroup>
        </div>
        <div className="w-2/3">
            <GraphChart prop={props.prop} {...graph} />
        </div>
        <div className="w-1/3">
            <GraphReferenceTable prop={props.prop} {...graph} />
        </div>
    </div>

}