"use client";

import { cn } from "@nextui-org/react";

import { MultipleGraphColumn } from "@/state/useMultipleGraphs";
import { PropertyGraphChart } from "./inner/propertyGraphChart";
import { PropertyGraphHeader } from "./inner/propertyGraphHeader";
import { PropertyGraphSettings } from "./inner/propertyGraphSettings";
import { PropertyGraphPropsType, useGraphInstance } from "./useGraph";



export const PropertyGraph: React.FC<PropertyGraphPropsType> = props => {

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
            <PropertyGraphHeader prop={props.prop} {...graph}/>
            <PropertyGraphSettings prop={props.prop} {...graph}/>
        </div>
        <div>
            <PropertyGraphChart prop={props.prop} {...graph}/>
        </div>
    </div>
}