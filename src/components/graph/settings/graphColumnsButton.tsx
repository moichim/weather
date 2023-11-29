"use client";

import { useGraphContext } from "@/state/graphContext";
import { MultipleGraphColumn } from "@/state/useMultipleGraphs";
import { Button } from "@nextui-org/react";

type GraphColumnButtonProps = {
    number: MultipleGraphColumn
}

export const GraphColumnButton: React.FC<GraphColumnButtonProps> = (props) => {

    const { multiple: graph } = useGraphContext();

    return <Button
        onClick={ () => {
            graph.setColumns( props.number )
        } }
        variant={graph.columns === props.number ? "solid" : "bordered"}
        isIconOnly
        size="sm"
    >{ props.number }</Button>
}