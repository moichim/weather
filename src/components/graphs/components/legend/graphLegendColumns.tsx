"use client"

import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";
import { GraphLegendItemDetail } from "./partials/GraphLegendItemDetail";
import { useLegendColumns } from "./utils/useLegendColumns";
import { LegendWithDescription } from "./graphLegend";

type GraphLegendCustomType = {
    name: string,
    color: string,
    in: string
}

export const GraphLegendColumns: React.FC<LegendWithDescription> = ( {
    showDescription = false, 
    ...props
} ) => {

    const columns = useLegendColumns();

    if ( columns === undefined )
        return <></>;

    return <>

        {Object.entries( columns ).map( ([property,columns]) => <div key={property}>
            <h3 className="mb-2">{property}</h3>
            <ul className="list-disc">
                {columns.map( column => <GraphLegendItemDetail {...column} key={column.name?.toString()} showDescription={showDescription}/> )}
            </ul>
        </div> )}

    </>
}