"use client";

import { graphInstanceSizes } from "@/components/settings/graphs/graphStackSettings";
import { ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { useGraphContext } from "@/state/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { Button, Tooltip } from "@nextui-org/react";

export const GraphConfigScale: React.FC<GraphInstanceState> = props => {

    const {stack} = useGraphContext();

    return <>

        {graphInstanceSizes.map(size => {
            return <Button
                onClick={ () => stack.dispatch(StackActions.setInstanceHeight( props.property.slug, size.key )) }
                isIconOnly
                variant="light"
                className={stack.state.graphs[props.property.slug]?.scale === size.key ? "bg-gray-100" :"bg-white"}
            >{size.name}</Button>
        })}

    </>

}