"use client";

import { graphInstanceSizes } from "@/state/graph/components/graphSizesButtonGroup";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { GraphSettingButton } from "./ui/graphSettingButton";

export const GraphConfigScale: React.FC<GraphInstanceState> = props => {

    const {graphState, graphDispatch} = useGraphContext();

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