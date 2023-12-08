"use client"

import { useGraphContext } from "@/state/graphStackContext";
import { GraphInstance } from "./graphInstance";
import { Toolbar } from "../ui/toolbar/toolbar";

export const Graphs: React.FC = () => {

    const { stack } = useGraphContext();

    return <div
        className="w-full h-full bg-gray-200 pb-[10rem] pt-3 min-h-full"
    >

        {Object.values( stack.state.graphs ).map( graph => <GraphInstance {...graph}/> )}

        <Toolbar />

    </div>

}