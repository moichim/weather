"use client"

import { useGraphContext } from "@/state/graph/graphContext";
import { GraphInstance } from "./graphInstance";
import { Toolbar } from "../../state/graph/components/toolbar/toolbar";
import { GraphAdd } from "./components/graphAdd";

export const Graphs: React.FC = () => {

    const { graphState: state } = useGraphContext();

    return <div
        className="w-full h-full bg-gray-200 pb-[10rem] pt-3 min-h-full"
    >

        {Object.values( state.graphs ).map( graph => <GraphInstance key={graph.property.slug} {...graph}/> )}

        <GraphAdd />

        <Toolbar />

    </div>

}