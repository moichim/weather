"use client"

import { useGraphContext } from "@/state/graph/graphContext";
import React from "react";
import { Toolbar } from "../toolbar/toolbar";
import { GraphAdd } from "./components/graphAdd";
import { GraphInstance } from "./graphInstance";
import { GraphTour } from "./graphTour";

export const Graphs: React.FC = () => {

    const { graphState: state } = useGraphContext();

    return <div>

            <GraphTour />
            
            <div id="one" className="w-full h-full bg-gray-200 pb-[10rem] pt-3 min-h-full" >

                {Object.values(state.graphs).map((graph, index) => <GraphInstance 
                    key={graph.property.slug} 
                    id={`graph${index}`}
                    {...graph} 
                />)}

                <GraphAdd />

                <Toolbar />

            </div>
    </div >
}