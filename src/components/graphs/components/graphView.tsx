"use client";

import { GraphTools } from "@/state/graph/data/tools";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphDomain, GraphInstanceState, graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { DataActionsFactory } from "@/state/meteo/reducerInternals/actions";
import { stringLabelFromTimestamp } from "@/utils/time";
import { Skeleton, Spinner, cn } from "@nextui-org/react";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useGraphInstanceMeteo } from "../utils/useGraphInstancData";
import { useTimeContext } from "@/state/time/timeContext";
import { TimeEventsFactory, TimePeriod } from "@/state/time/reducerInternals/actions";


export const GraphView: React.FC<GraphInstanceState> = props => {

    const { graphState, graphDispatch } = useGraphContext();

    const { data: graphData, isLoadingData } = useGraphInstanceMeteo(props.property.slug);

    const time = useTimeContext();

    const domain = props.domain === GraphDomain.DEFAULT || props.domain === GraphDomain.MANUAL
        ? [props.domainMin ?? "auto", props.domainMax ?? "auto"]
        : ["auto", "auto"];

    const [isSelectingLocal, setIsSelectingLocal] = useState<boolean>(false);
    const [cursor, setCursor] = useState<number>();

    useEffect(() => {
        if (isSelectingLocal === false) setCursor(undefined);
    }, [isSelectingLocal]);

    const [isHovering, setIsHovering] = useState<boolean>(false);

    const onMouseMove: CategoricalChartFunc = useCallback(event => {
        if ("activeLabel" in event) {
            if (!isHovering)
                setIsHovering(true);
            else setCursor(parseInt(event.activeLabel!));
        } else {
            if (isHovering) setIsHovering(false);
            if (time.timeState.isSelecting) {
                time.timeDispatch( TimeEventsFactory.clearSelection() );
            }
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
                setCursor(undefined);
            }
        }
    }, [isHovering, time.timeState.isSelecting, isSelectingLocal, time.timeDispatch])

    const onClick: CategoricalChartFunc = useCallback(event => {

        if (graphState.activeTool === GraphTools.INSPECT) return;

        if (graphState.activeTool === GraphTools.SELECT || graphState.activeTool === GraphTools.ZOOM) {

            if (isSelectingLocal) {

                let from = time.timeState.selectionCursor!;
                let to = parseInt(event.activeLabel!);

                time.timeDispatch( TimeEventsFactory.endSelection( to, TimePeriod.HOUR ) );

                setIsSelectingLocal(false);

                if (graphState.activeTool === GraphTools.ZOOM) {

                    time.timeDispatch( TimeEventsFactory.setRange( from, to, TimePeriod.DAY ) );

                    graphDispatch(StackActions.selectTool(GraphTools.INSPECT));
                }

                return;

            } else {

                time.timeDispatch( TimeEventsFactory.startSelection( parseInt( event.activeLabel! ), TimePeriod.HOUR ) );

                // dispatch(DataActionsFactory.startSelectingRange(parseInt(event.activeLabel!)));
                setCursor(parseInt(event.activeLabel!));
                setIsSelectingLocal(true);
                return;
            }

        }

    }, [graphState.activeTool, time.timeState.selectionCursor, isSelectingLocal, time.timeDispatch, graphDispatch]);

    let mouse = useMemo(() => isHovering ?
        graphState.activeTool === GraphTools.INSPECT
            ? "help"
            : graphState.activeTool === GraphTools.SELECT
                ? "crosshair"
                : "crosshair"
        : "auto", [isHovering, graphState.activeTool]);

    const ticks = useMemo(() => {

        let durationInHours = graphData ? graphData.data.length : 0;

        let times = (durationInHours > 0 && graphData) ? Object.values(graphData.data)
            .map(entry => entry.time) : [];

        let formatter: ((value: any, index: number) => string) | undefined = name => {
            return format(new Date(name), "H");
        };

        if (durationInHours >= 26 && durationInHours < 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23 || hour === 11) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "H:mm");
            };
        }

        if (durationInHours >= 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "d.M.");
            };
        }

        return {
            times,
            formatter
        }

    }, [graphData]);

    const formatLabel = useCallback((value: number) => stringLabelFromTimestamp(value), []);

    const formatTooltip = useCallback((value: number, property: any) => value.toFixed(3), []);

    const containerId = useMemo(() => `${props.id}view`, [props.id]);
    const height = useMemo(() => graphInstanceHeights[props.scale], [props.scale]);

    // Show sleketon whenever the data is loading or unpresent
    if (isLoadingData === true && graphData === undefined)
        return <div id={containerId} className="relative">
            <Skeleton
                className={cn(
                    "w-full rounded-xl bg-gray-400"
                )}
                style={{ height: height }}
            />
        </div>



    return <div className="relative" id={containerId}>

            <ResponsiveContainer
                width={"100%"}
                height={height}
            >
                <LineChart
                    data={graphData?.data}
                    margin={{ left: 50 }}
                    syncId={"syncId"}
                    onClick={onClick}
                    onMouseMove={isSelectingLocal ? onMouseMove : undefined}
                    // onMouseMove={onMouseMove}
                    style={{ cursor: mouse }}
                >

                    {time.timeState.isSelecting ?
                        time.timeState.selectionCursor && <ReferenceLine
                            x={time.timeState.selectionCursor}
                            stroke="black"
                        />
                        : (time.timeState.selectionFrom && time.timeState.selectionTo) && <ReferenceArea x1={time.timeState.selectionFrom} x2={time.timeState.selectionTo} />
                    }

                    {(isSelectingLocal && time.timeState.selectionCursor) && <ReferenceArea
                        x1={time.timeState.selectionCursor}
                        x2={cursor}
                    />}

                    <CartesianGrid strokeDasharray={"2 2"} />

                    {graphData && graphData.lines.map(source => {

                        return <Line
                            key={source.slug}
                            dataKey={source.slug}
                            dot={false}
                            unit={" " + props.property.unit ?? ""}
                            stroke={source.stroke}
                            isAnimationActive={false}
                            name={source.name}
                        />

                    })}

                    {graphData && graphData.dots.map(dot => {
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


                    <XAxis
                        dataKey="time"
                        tickFormatter={ticks.formatter}
                        ticks={ticks.times}
                    />


                    <YAxis
                        unit={props.property.unit}
                        domain={domain as any}
                    />

                    <Tooltip
                        labelFormatter={formatLabel}
                        formatter={formatTooltip}

                        isAnimationActive={false}
                        coordinate={{ x: cursor, y: 0 }}
                    />

                </LineChart>

            </ResponsiveContainer>

            {( graphData !== undefined && isLoadingData === true ) && <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50">
                <Spinner size="lg" color="primary" />
            </div>}
    </div>
}