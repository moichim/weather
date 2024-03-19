"use client";

import { graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { GraphInstanceProps } from "../../context/useDataContextInternal";
import { GraphinstanceSelector } from "./inner/graphInstanceSelector";
import { GraphInstanceSizes } from "./inner/graphInstanceSizes";
import { useMemo } from "react";
import { Statistics } from "./inner/statistics";
import { GraphView } from "./inner/view/graphView";

export const GraphInstance: React.FC<GraphInstanceProps> = props => {

    const height = useMemo(() => graphInstanceHeights[props.state.scale], [props.state.scale]);

    return <div
        className="w-full gap-4"
    >

        <div className="flex flex-wrap w-full" style={{ minHeight: `${height}px` }}>

            <div className="w-full md:w-1/3 lg:w-1/6 flex flex-wrap flex-col gap-4 justify-cener items-center md:items-end">

                    <GraphinstanceSelector
                        setter={props.setProperty}
                        property={props.state.property}
                        availableProperties={props.availableProperties}
                        loading={props.loadingData}
                    />

                    <GraphInstanceSizes
                        setter={props.setHeight}
                        height={props.state.scale}
                        loading={props.loadingData}
                    />

            </div>

            <div className="w-full lg:w-3/6">
                <GraphView
                    {...props}
                    height={height}
                />
            </div>

            <div className="w-full lg:w-1/3 ">
                <Statistics 
                    data={props.viewStats}
                    label="Rozsah"
                    loading={props.viewStatsLoading}
                />
            </div>

        </div>

    </div>

}