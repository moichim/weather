"use client";

import { useDisplayContext } from "@/state/displayContext"
import { SinglePropertyGraph } from "./singlePropertyGraph";

export const GraphsGrid: React.FC = () => {

    const setting = useDisplayContext();

    return <div className="flex items-stretch flex-wrap w-full h-full">

        {setting.multiple.activeProps.map( prop => <SinglePropertyGraph key={prop} prop={prop} /> )}

    </div>

}