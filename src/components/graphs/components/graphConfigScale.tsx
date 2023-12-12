"use client";

import { graphInstanceSizes } from "@/components/settings/graphs/graphStackSettings";
import { useGraphContext } from "@/state/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { GraphSettingButton } from "./ui/graphSettingButton";

export const GraphConfigScale: React.FC<GraphInstanceState> = props => {

    const {stack} = useGraphContext();

    return <>

        {graphInstanceSizes.map(size => {

            return <GraphSettingButton 
                key={size.key}
                active={ stack.state.graphs[props.property.slug]?.scale === size.key }
                onClick={()=>stack.dispatch( StackActions.setInstanceHeight( props.property.slug, size.key ) )}
                tooltip={size.label}
            >{size.name}</GraphSettingButton>

        })}

    </>

}