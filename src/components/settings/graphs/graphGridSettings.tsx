"use client";

import { useState, useEffect } from "react";
import { useDisplayContext } from "@/state/displayContext";
import { Button, Input, Pagination } from "@nextui-org/react";
import { MultipleGraphColumn, maxHeight, minHeight } from "@/state/useMultipleGraphs";
import { GraphColumnButton } from "./graphColumnsButton";

export const GraphGridSettings: React.FC = () => {

    const { set: graph } = useDisplayContext();

    const [value, setValue] = useState<number>(graph.height);

    useEffect(() => {

        const fn = () => {

            const height = value < minHeight
                ? minHeight
                : value > maxHeight
                    ? maxHeight
                    : value;

            if (height !== graph.height) {
                graph.setHeight(height);
            }

        };

        const timeout = setTimeout(fn, 200);

        return () => clearTimeout(timeout);

    }, [value, graph]);

    useEffect(() => {
        if (graph.height !== value) {
            setValue(graph.height);
        }
    }, [graph.height]);

    return <div className="flex items-center gap-3">

        <Input
            type="number"
            label="Výška grafu"
            value={value.toString()}
            step={50}
            min={100}
            max={900}
            onChange={event => setValue(parseInt(event.target.value))}
            size="sm"
        />
        <div className="rounded-lg bg-gray-100 p-2">

            {/* <div className="text-xs text-gray-600 mb-1">Počet sloupců</div> */}
            <div className="flex gap-3">
                <GraphColumnButton number={MultipleGraphColumn.ONE} />
                <GraphColumnButton number={MultipleGraphColumn.TWO} />
                <GraphColumnButton number={MultipleGraphColumn.THREE} />
            </div>
        </div>

        <div>
            <Button 
                variant="bordered"
                size="lg"
                onClick={ () => {
                    setValue( 500 );
                    graph.setColumns(2);
                }}
            >Výchozí rozložení</Button>
        </div>

        

    </div>
}