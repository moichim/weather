"use client";

import { Sources } from "@/graphql/weatherSources/source";
import { useDisplayContext } from "@/state/displayContext";
import { prepareGraphData, useWeatherContext } from "@/state/weatherContext";
import { Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { useMemo, useState, useEffect, useCallback } from "react";
import { CartesianGrid, ComposedChart, Line, LineChart, ReferenceArea, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import { PropertyGraphModes, PropertyGraphWithStateType } from "./propertyGraph";
import { useFilterContext } from "@/state/filterContext";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { Tool } from "@/state/useMultipleGraphs";
import { stringFromTimestampFrom, stringFromTimestampTo } from "@/utils/time";

export const PropertyGraphChart: React.FC<PropertyGraphWithStateType> = props => {
    const queryData = useWeatherContext();

    const { grid: graph } = useDisplayContext();

    const filter = useFilterContext();

    const content = useMemo(()=> prepareGraphData( props.prop, queryData.data ?? {weatherRange: [], valueRange: []} ), [ props.prop, queryData.data ]);

    const domain = props.domain === PropertyGraphModes.NONE
        ? ["auto","auto"]
        : [ props.min ?? "auto", props.max ?? "auto" ]

    const [isHovering, setIsHovering] = useState<boolean>( false );
    const [isSelecting, setIsSelecting] = useState<boolean>( false );

    useEffect( () => {
        if ( isHovering === false && isSelecting === true )
            setIsSelecting( false );
    }, [ isHovering, isSelecting ] );

    const onMouseMove: CategoricalChartFunc = useCallback( event => {

        const isInChart = "activeLabel" in event;

        // Anytime mouse is out, make sure hovering is marked
        if ( !isInChart ) {
            if ( isHovering === true ) {
                setIsHovering( false );
            }
        } 
        // Anytime the mouse is in...
        else {
            // ... make sure hovering is off
            if ( isHovering === false )
                setIsHovering( true );
            // ... and if is selecting, update the reference
            else if (isSelecting) {

                const coord = parseInt( event.activeLabel! );

                if ( coord < graph.reference!.from )
                    graph.setReference( {
                        from: coord,
                        to: graph.reference!.to
                    } );
                else {
                    graph.setReference( {
                        from: graph.reference!.from,
                        to: coord
                    } );
                }

            }
        }

    }, [isHovering, setIsHovering, graph.reference ] );

    const onMouseLeave: CategoricalChartFunc = useCallback( () => {
        setIsHovering( false );
        setIsSelecting( false );
    }, [ isHovering, isSelecting ] );


    const onDown: CategoricalChartFunc = useCallback( event => {


        if ( event.activeLabel ) {

            if ( !isSelecting ) {

                setIsSelecting( true );

                const value = parseInt( event.activeLabel );
                graph.setReference({
                    from: value,
                    to: value
                });

            }

        }


    }, [ graph.reference, isSelecting ] );

    const onUp: CategoricalChartFunc = event => {

        if ( event.activeLabel ) {

            if ( isSelecting ) {
                setIsSelecting( false );
                onSelectionComplete();
            }

        }

        if ( graph.reference ) {

            if ( graph.reference.from === graph.reference.to )
                graph.setReference( undefined );
        }

    }


    const onSelectionComplete = () => {

        if ( graph.tool === Tool.SELECT ) {}
        else if ( graph.tool === Tool.ZOOM ) {

            if ( graph.reference ) {
                filter.setFrom( stringFromTimestampFrom( graph.reference.from ) );
                filter.setTo( stringFromTimestampTo( graph.reference.to ) );
            }

        }

    }


    return <div className="relative">
        <ResponsiveContainer
            width={"100%"}
            height={graph.height}
        >
            <ComposedChart
                data={content.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseDown={onDown}
                onMouseUp={onUp}
            >

                <CartesianGrid />

                {graph.reference && 
                    <ReferenceArea
                        x1={graph.reference.from}
                        x2={graph.reference.to}
                        strokeOpacity={0.3}
                    />
                }

                {content.lines.map( src => {

                    return <Line 
                        key={src.slug}
                        dataKey={src.slug}
                        unit={content.property.unit ?? ""}
                        dot={false}
                        stroke={src.stroke}
                        isAnimationActive={false}
                    />
                    
                } ) }

                {content.dots.map( src => {

                    return <Scatter 
                        key={src.slug}
                        fill={src.color}
                        stroke={src.color}
                        dataKey={src.slug}
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
                    unit={content.property.unit} 
                    domain={domain as any}
                />

                <Tooltip
                    formatter={(value: number, name, props) => {
                        return [value.toFixed(3), content.labels[name] ?? name];
                    }}
                    labelFormatter={(value) => {
                        return format(new Date(value), "d. M. Y H:mm");
                    }}
                    isAnimationActive={false}
                />

            </ComposedChart>

        </ResponsiveContainer>

        {queryData.loading && <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <Spinner size="lg" color="default"/>
        </div>}
    </div>
}