"use client"

import { LegendWithDescription } from "./graphLegend";
import { GraphLegendItemDetail } from "./partials/GraphLegendItemDetail";
import { useLegendSources } from "./utils/useLegendSources";



export const GraphLegendSources: React.FC<LegendWithDescription> = ({
    showDescription = false, 
    ...props
} )=> {

    const sources = useLegendSources();

    return <ul className="list-disc">
        {sources.map( property => <GraphLegendItemDetail key={property.name} {...property} showDescription={showDescription} /> )}
    </ul>
}