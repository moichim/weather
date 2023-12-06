"use client";

import { useDisplayContext } from "@/state/displayContext"
import { GraphGridInstance } from "../graphGrid/graphGridInstance";
import { GraphStackInstance } from "./graphStackInstance";
import { Toolbar } from "../ui/toolbar/toolbar";

export const GraphStack: React.FC = () => {

    const setting = useDisplayContext();

    return <div className="w-full pb-10 relative bg-gray-100">

        {setting.set.activeProps.map( (prop, index) => <GraphStackInstance key={prop} prop={prop} index={index} /> )}

        <Toolbar
            tool={setting.set.tool}
            setTool={setting.set.setTool}
            tools={setting.set.toolbar}
        />

    </div>

}