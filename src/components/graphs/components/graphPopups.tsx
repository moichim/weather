"use client";

import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { useMeteoContext } from "@/state/meteo/meteoContext";
import { Skeleton } from "@nextui-org/react";
import { GraphConfigPopup } from "./popups/graphConfigPopup";
import { GraphRemoveButton } from "./popups/graphRemoveButton";

export const GraphPopups: React.FC<GraphInstanceState> = props => {
    const meteo = useMeteoContext();

    if ( meteo.data === undefined ) {
        return <Skeleton className="rounded-xl w-16 h-8 bg-gray-400" />
    }

    return <>
        <GraphConfigPopup {...props} />
        <GraphRemoveButton {...props} />
    </>
}