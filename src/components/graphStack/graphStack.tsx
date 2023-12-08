"use client";

import { useDisplayContext } from "@/state/displayContext";
import { Toolbar } from "../ui/toolbar/toolbar";
import { GraphStackInstance } from "./graphStackInstance";

export const GraphStack: React.FC = () => {

    const setting = useDisplayContext();

    return <div className="w-full pb-10 relative bg-gray-100">

        {setting.set.activeProps.map((prop, index) => <GraphStackInstance key={prop} prop={prop} index={index} />)}

        <Toolbar />

    </div>

}