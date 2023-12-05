"use client";

import { useDisplayContext } from "@/state/displayContext";
import { Brush } from "recharts";
import { Toolbar } from "../ui/toolbar/toolbar";
import { PropertyGraph } from "./propertyGraph/propertyGraph";

export const GraphsGrid: React.FC = () => {

    const setting = useDisplayContext();


    return <div className="flex items-stretch flex-wrap w-full h-full">

        {setting.grid.activeProps.map(prop => <PropertyGraph key={prop} prop={prop} />)}

        <Toolbar
            tool={setting.grid.tool}
            setTool={setting.grid.setTool}
            tools={setting.grid.toolbar}
        />

    </div>

}