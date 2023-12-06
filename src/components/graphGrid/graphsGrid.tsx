"use client";

import { useDisplayContext } from "@/state/displayContext";
import { Brush } from "recharts";
import { Toolbar } from "../ui/toolbar/toolbar";
import { GraphGridInstance } from "./graphGridInstance";

export const GraphGrid: React.FC = () => {

    const setting = useDisplayContext();

    return <div className="flex items-stretch flex-wrap w-full h-full">

        {setting.set.activeProps.map(prop => <GraphGridInstance key={prop} prop={prop} />)}

        <Toolbar
            tool={setting.set.tool}
            setTool={setting.set.setTool}
            tools={setting.set.toolbar}
        />

    </div>

}