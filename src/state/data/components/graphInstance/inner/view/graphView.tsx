"use client";

import { GraphInstanceProps } from "@/state/data/context/useDataContextInternal"
import { useTimeContext } from "@/state/time/timeContext"
import { Progress } from "@nextui-org/react"
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useGraphViewDomain } from "./useGraphDomain"
import { useGraphViewInteractions } from "./useGraphViewInteractions"
import { useGraphViewTicks } from "./useGraphViewTicks"
import { useCallback } from "react";
import { stringLabelFromTimestamp } from "@/utils/time";

type GraphViewProps = GraphInstanceProps & {
    height: number
}

export const GraphView: React.FC<GraphViewProps> = props => {

    const { timeState } = useTimeContext();

    const domain = useGraphViewDomain(props.state.domain, props.state.domainMin);

    const ticks = useGraphViewTicks(props);

    const {
        onMouseMove,
        onClick,
        cursor,
        isSelectingLocal
    } = useGraphViewInteractions();



    let CursorMarkerForAllGraphs: JSX.Element = <></>;

    // If is selecting, return the cursor marker or the selection highlight
    if (timeState.isSelecting) {

        // If the selection is incomplete, show the marker
        if (timeState.selectionCursor) {
            CursorMarkerForAllGraphs = <ReferenceLine
                x={timeState.selectionCursor}
                stroke="black"
            />
        }
        // If the selection is complete, return the reference area
        if (timeState.selectionFrom !== undefined && timeState.selectionTo !== undefined) {
            <ReferenceArea
                x1={timeState.selectionFrom}
                x2={timeState.selectionTo}
            />
        }
    }

    let CursorMarkerForCurrentlySelectingGraph: JSX.Element = <></>;

    if (isSelectingLocal && timeState.selectionCursor) {
        CursorMarkerForCurrentlySelectingGraph = <ReferenceArea
            x1={timeState.selectionCursor}
            x2={cursor}
        />
    }

    console.log(timeState.selectionFrom, timeState.selectionTo);

    const formatLabel = useCallback((value: number) => stringLabelFromTimestamp(value), []);

    const formatTooltip = useCallback((value: number, property: any) => value.toFixed(3), []);


    if (props.graphData === undefined) {
        return <div className="pl-[100px] pb-4 w-full h-full">
            <div className="flex w-full h-full border-2 border-gray-400 border-dashed items-center justify-center">
                <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md"
                />
            </div>
        </div>
    }

    return <div className="relative w-full">

        <ResponsiveContainer
            width="100%"
            height={props.height}
        >
            <LineChart
                data={props.graphData.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onMouseMove={onMouseMove}
                onClick={onClick}

            >

                {CursorMarkerForAllGraphs}

                {CursorMarkerForCurrentlySelectingGraph}

                {(timeState.selectionFrom !== undefined && timeState.selectionTo) && <ReferenceArea
                    x1={timeState.selectionFrom}
                    x2={timeState.selectionTo}
                />}


                <CartesianGrid strokeDasharray={"2 2"} />

                {props.graphData && props.graphData.lines.map(source => {

                    return <Line
                        key={source.slug}
                        dataKey={source.slug}
                        dot={false}
                        unit={" " + props.state.property.unit ?? ""}
                        stroke={source.stroke}
                        isAnimationActive={false}
                        name={source.name}
                    />

                })}

                {props.graphData && props.graphData.dots.map(dot => {
                    return <Line
                        key={dot.slug}
                        fill={dot.color}
                        stroke={dot.color}
                        dataKey={dot.slug}
                        isAnimationActive={false}
                        unit={dot.in.unit ?? ""}
                        connectNulls={true}
                        name={dot.name}
                    />
                })}

                <YAxis
                    unit={props.state.property.unit}
                    domain={domain as any}
                />

                <XAxis
                    dataKey="time"
                    tickFormatter={ticks.formatter}
                    ticks={ticks.times}
                />

                <Tooltip
                    labelFormatter={formatLabel}
                    formatter={formatTooltip}

                    isAnimationActive={false}
                    coordinate={{ x: cursor, y: 0 }}
                />

            </LineChart>
        </ResponsiveContainer>

    </div>

}