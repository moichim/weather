"use client";

import { GraphLegendSources } from "./graphLegendSources"
import { GraphLegendColumns } from "./graphLegendColumns"
import { useScopeContext } from "@/state/scope/scopeContext";

export type GraphLegendType = {
    showDescriptionColumns: boolean,
    showDescriptionSources: boolean
}

export type LegendWithDescription = {
    showDescription?: boolean
}

export const GraphLegend: React.FC<GraphLegendType> = ({
    showDescriptionSources = false, 
    showDescriptionColumns = false,
    ...props 
}) => {

    const {activeScope} = useScopeContext();

    if (activeScope === undefined) 
        return <></>;

    return <>
        <p>Tým <strong>{activeScope.name}</strong> působí v lokalitě <strong>{activeScope.locality}</strong>. Ve svém měření zaznamenává tyto údaje:</p>
        <GraphLegendColumns showDescription={showDescriptionColumns}/>

        <p>Dále jsou v grafu k dispozici meterologická data z těchto zdrojů:</p>
        <GraphLegendSources showDescription={showDescriptionSources} />

    </>
}