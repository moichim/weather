"use client";

import { StackActions } from "@/state/graph/reducerInternals/actions";
import { useGraphContext } from "@/state/graph/graphContext";
import { GraphDomain, GraphInstanceState, graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { GraphTools } from "@/state/graph/data/tools";
import { DataActionsFactory } from "@/state/meteo/reducerInternals/actions";
import { Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useGraphInstanceMeteo } from "../utils/useGraphInstancData";


export const GraphView: React.FC<GraphInstanceState> = props => {

    const { graphState, graphDispatch } = useGraphContext();

    const { data: graphData, selection, dispatch, isLoadingData } = useGraphInstanceMeteo(props.property.slug);

    const domain = props.domain === GraphDomain.DEFAULT || props.domain === GraphDomain.MANUAL
        ? [props.domainMin ?? "auto", props.domainMax ?? "auto"]
        : ["auto", "auto"];

    const [isSelectingLocal, setIsSelectingLocal] = useState<boolean>(false);
    const [cursor, setCursor] = useState<number>();

    useEffect(() => {
        if (isSelectingLocal === false) setCursor(undefined);
    }, [isSelectingLocal]);

    const data = graphData?.data;

    const [isHovering, setIsHovering] = useState<boolean>(false);

    const onMouseMove: CategoricalChartFunc = event => {
        if ("activeLabel" in event) {
            if (!isHovering)
                setIsHovering(true);
            else setCursor(parseInt(event.activeLabel!));
        } else {
            if (isHovering) setIsHovering(false);
            if (selection.isSelectingRange) {
                dispatch(DataActionsFactory.removeRange());
            }
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
                setCursor(undefined);
            }
        }
    }

    const onClick: CategoricalChartFunc = event => {

        if (graphState.activeTool === GraphTools.INSPECT) return;

        if (!isHovering) {
            dispatch(DataActionsFactory.removeRange());
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
            }
            return;
        };

        /*

        if (selection.hasRange) {
            dispatch(DataActionsFactory.removeRange());
            setIsSelectingLocal(false);
            return;
        }

        */

        if (!selection.isSelectingRange) {
            dispatch(DataActionsFactory.startSelectingRange(parseInt(event.activeLabel!)));
            setIsSelectingLocal(true);
            return;
        } else {

            let from = selection.rangeTempFromTimestamp!;
            let to = parseInt(event.activeLabel!);

            dispatch(DataActionsFactory.endSelectingRange(parseInt(event.activeLabel!)));

            setIsSelectingLocal(false);

            if (graphState.activeTool === GraphTools.ZOOM) {

                dispatch(DataActionsFactory.setFilterTimestamp(from, to));

                graphDispatch(StackActions.selectTool(GraphTools.INSPECT));
            }

        }

    };

    let mouse = isHovering ?
        graphState.activeTool === GraphTools.INSPECT
            ? "help"
            : graphState.activeTool === GraphTools.SELECT
                ? "crosshair"
                : "crosshair"
        : "auto";

    const ticks = useMemo( () => {

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
                console.log(hour, minute, second, result);
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

    }, [graphData, graphData?.data, graphData?.data.length] );



    return <div className="relative">
        <ResponsiveContainer
            width={"100%"}
            height={graphInstanceHeights[props.scale]}
        >
            <ComposedChart
                data={data}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onClick={onClick}
                onMouseMove={onMouseMove}
                style={{ cursor: mouse }}
            >

                {selection.isSelectingRange ?
                    selection.rangeTempFromTimestamp && <ReferenceLine
                        x={selection.rangeTempFromTimestamp}
                        stroke="black"
                    />
                    : (selection.rangeMinTimestamp && selection.rangeMaxTimestamp) && <ReferenceArea x1={selection.rangeMinTimestamp} x2={selection.rangeMaxTimestamp} />
                }

                {(isSelectingLocal && selection.rangeTempFromTimestamp) && <ReferenceArea
                    x1={selection.rangeTempFromTimestamp}
                    x2={cursor}
                />}

                <CartesianGrid strokeDasharray={"2 2"} />

                {graphData && graphData.lines.map(source => {

                    return <Line
                        key={source.slug}
                        dataKey={source.slug}
                        dot={false}
                        unit={props.property.unit ?? ""}
                        stroke={source.stroke}
                        isAnimationActive={false}
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
                    labelFormatter={(value) => {
                        return format(new Date(value), "d. M. Y H:mm");
                    }}
                    isAnimationActive={false}
                />



            </ComposedChart>

        </ResponsiveContainer>

        {isLoadingData && <div className="absolute w-full h-full top-0 height-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <Spinner size="lg" />
        </div>}

    </div>
}