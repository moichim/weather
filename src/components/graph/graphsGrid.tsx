"use client";

import { useGraphContext } from "@/state/graphContext"
import { SinglePropertyGraph } from "./singlePropertyGraph";

export const GraphsGrid: React.FC = () => {

    const setting = useGraphContext();

    return <div className="flex items-stretch flex-wrap w-full h-full">

        {setting.multiple.activeProps.map( prop => <SinglePropertyGraph key={prop} prop={prop} /> )}

    </div>

}