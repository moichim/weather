"use client";

import { cn } from "@nextui-org/react";

import { MultipleGraphColumn } from "@/state/useMultipleGraphs";
import { GraphChart } from "../graphCommons/components/graphChart";
import { GraphHeader } from "../graphCommons/components/graphHeader";
import { GraphSettings } from "../graphCommons/components/graphSettings";
import { PropertyGraphPropsType, useGraphInstance } from "../graphCommons/useGraph";



export const GraphGridInstance: React.FC<PropertyGraphPropsType> = props => {

    const graph = useGraphInstance( props.prop );

    return <div className={cn([
        "w-full p-10",
        graph.display.columns === MultipleGraphColumn.ONE
            ? "lg:w-full"
            : graph.display.columns === MultipleGraphColumn.TWO
                ? "lg:w-1/2"
                : "lg:w-1/3"
    ])} >
        <div className="pb-5 flex items-center ml-[6rem] gap-3">
            <GraphHeader prop={props.prop} {...graph}/>
            <GraphSettings prop={props.prop} {...graph}/>
        </div>
        <div>
            <GraphChart prop={props.prop} {...graph}/>
        </div>
    </div>
}