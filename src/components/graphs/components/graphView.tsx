"use client";

import { useGraphContext } from "@/state/useGraphStack/graphStackContext";
import { GraphDomain, GraphInstanceState, graphInstanceHeights } from "@/state/useGraphStack/storage";
import { Spinner, cn } from "@nextui-org/react";
import { format } from "date-fns";
import { CartesianGrid, ComposedChart, Line, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import { GraphInstanceWithDataPropsType } from "../graphInstance";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { StackActions } from "@/state/useGraphStack/actions";
import { useEffect, useState } from "react";
import { GraphTools } from "@/state/useGraphStack/tools";
import { stringFromTimestampFrom, stringFromTimestampTo } from "@/utils/time";
import { useGraphInstanceMeteo } from "../useGraphinstanceMeteo";
import { DataActions, DataActionsFactory } from "@/state/useMeteoData/reducerInternals/actions";
import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext";

export const GraphView: React.FC<GraphInstanceState> = props => {

    const { stack } = useGraphContext();

    const { data: graphData, selection, dispatch, isLoading } = useGraphInstanceMeteo( props.property.slug );

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
            if (stack.state.isSelecting) {
                //stack.dispatch(StackActions.selectionRemove());
                dispatch( DataActionsFactory.removeRange() );
            }
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
                setCursor(undefined);
            }
        }
    }

    const onClick: CategoricalChartFunc = event => {

        if ( stack.state.activeTool === GraphTools.INSPECT ) return;

        if (!isHovering) {
            stack.dispatch(StackActions.selectionRemove());
            if (isSelectingLocal) {
                setIsSelectingLocal(false);
            }
        };

        if (stack.state.selectionStart && stack.state.selectionEnd) {
            // stack.dispatch(StackActions.selectionRemove());
            dispatch( DataActionsFactory.removeRange() );
            setIsSelectingLocal(false);
        }

        if (!stack.state.isSelecting) {
            stack.dispatch(StackActions.selectionStart(props.property.slug, parseInt(event.activeLabel!)));
            setIsSelectingLocal(true);
        } else {

            let from = stack.state.selectionStart!;
            let to = parseInt( event.activeLabel! );

            if ( from > to ) {
                let fromTmp = from;
                from = to;
                to = fromTmp;
                stack.dispatch( StackActions.selectionStart( props.property.slug, from ) );
            }


            stack.dispatch(StackActions.selectionEnd(props.property.slug, to));

            setIsSelectingLocal(false);
            
            if ( stack.state.activeTool === GraphTools.ZOOM ) {
                // props.data.filter.setFrom( stringFromTimestampFrom( from ) );
                // props.data.filter.setTo( stringFromTimestampTo( to ) );

                dispatch( DataActionsFactory.setFilterTimestamp( from, to ) );

                stack.dispatch( StackActions.selectTool( GraphTools.INSPECT ) );
            }

        }

    };

    let mouse = isHovering ?
        stack.state.activeTool === GraphTools.INSPECT
            ? "help"
            : stack.state.activeTool === GraphTools.SELECT
                ? "crosshair"
                : "crosshair"
        : "auto";


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

                <CartesianGrid strokeDasharray={"2 2"} />

                {graphData && graphData.lines.map( source => {

                    return <Line 
                        key={source.slug}
                        dataKey={source.slug}
                        dot={false}
                        unit={props.property.unit ?? ""}
                        stroke={source.stroke}
                        isAnimationActive={false}
                    />

                } )}

                {graphData && graphData.dots.map( dot => {
                    return <Line
                    key={dot.slug}
                    fill={dot.color}
                    stroke={dot.color}
                    dataKey={dot.slug}
                    isAnimationActive={false}
                // unit={cnt.property.unit ?? ""}
                /> 
                } )}


                <XAxis
                    dataKey="time"
                    tickFormatter={name => {
                        return format(new Date(name), "H")
                    }}
                    onMouseDown={console.log}
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

                {stack.state.isSelecting ?
                    stack.state.selectionStart && <ReferenceLine
                        x={stack.state.selectionStart}
                        stroke="black"
                    />
                    : (stack.state.selectionStart && stack.state.selectionEnd) && <ReferenceArea x1={stack.state.selectionStart} x2={stack.state.selectionEnd} />
                }

                {(isSelectingLocal && stack.state.selectionStart) && <ReferenceArea
                    x1={stack.state.selectionStart}
                    x2={cursor}
                />}

            </ComposedChart>

        </ResponsiveContainer>

        {isLoading && <div className="absolute w-full h-full top-0 height-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <Spinner size="lg" />
        </div>}

    </div>
}