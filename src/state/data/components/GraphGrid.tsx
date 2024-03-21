"use client";

import { Toolbar } from "@/components/toolbar/toolbar";
import { GoogleScope } from "@/graphql/google/google";
import { useDataContextInternal } from "../context/useDataContextInternal";
import { GraphInstance } from "./graphInstance/graphInstance";
import { SelectionBar } from "@/state/time/components/selectionBar";

export const GraphGrid: React.FC<GoogleScope> = props => {

    const context = useDataContextInternal(props);

    return <div className="relative">
        
        <div className="pl-4 pt-4 fixed bottom-4" style={{ width: "4rem" }}>
            <Toolbar />
        </div>

        <div className=" top-0 w-full pt-4">
            {
                context.instances.map(instance => {
                    return <GraphInstance
                        {...instance}
                        key={instance.state.property.slug}
                    />
                })}
        </div>

        <SelectionBar />

    </div>
}