"use client";

import { graphInstanceSizes } from "@/components/bar/graphSizesButtonGroup";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { GraphSettingButton } from "./ui/graphSettingButton";
import { useMeteoContext } from "@/state/meteo/meteoContext";
import { Skeleton } from "@nextui-org/react";

export const GraphConfigScale: React.FC<GraphInstanceState> = props => {

    const {graphState, graphDispatch} = useGraphContext();

    const meteo = useMeteoContext();

    if ( meteo.data === undefined ) {
        return <Skeleton className="rounded-xl w-48 h-8 bg-gray-400" />
    }

    return <>

        {graphInstanceSizes.map(size => {

            return <GraphSettingButton 
                id={props.id!}
                key={size.key}
                active={ graphState.graphs[props.property.slug]?.scale === size.key }
                onClick={()=>graphDispatch( StackActions.setInstanceHeight( props.property.slug, size.key ) )}
                tooltip={size.label}
            >{size.name}</GraphSettingButton>

        })}

    </>

}