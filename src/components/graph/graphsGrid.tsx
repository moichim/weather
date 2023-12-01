"use client";

import { useDisplayContext } from "@/state/displayContext"
import { PropertyGraph } from "./propertyGraph/propertyGraph";
import { Brush } from "recharts";

export const GraphsGrid: React.FC = () => {

    const setting = useDisplayContext();

    return <div className="flex items-stretch flex-wrap w-full h-full">

        <Brush />

        {setting.grid.activeProps.map( prop => <PropertyGraph key={prop} prop={prop} /> )}

    </div>

}