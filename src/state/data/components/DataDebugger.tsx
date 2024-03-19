"use client";

import { GoogleScope } from "@/graphql/google/google"
import { useData } from "../useData"
import { useGraphInternal } from "@/state/graph/useGraphInternal";
import { useGraphContext } from "@/state/graph/graphContext";
import { useDataContextInternal } from "../context/useDataContextInternal";
import { GraphInstance } from "./graphInstance/graphInstance";

export const DataDebugger: React.FC<GoogleScope> = props => {

    const context = useDataContextInternal(props);

    console.log(context);

    return <div>
        {
            context.instances.map(instance => {
                return <GraphInstance 
                    {...instance}
                    key={instance.state.property.slug}
                />
            })}
    </div>
}