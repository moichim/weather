"use client";

import { Tool } from "@/state/useMultipleGraphs";
import { stringFromTimestampFrom, stringFromTimestampTo } from "@/utils/time";
import { Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, ComposedChart, Line, ReferenceArea, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { PropertyGraphModes, PropertyGraphWithStateType } from "../useGraph";

export const PropertyGraphChart: React.FC<PropertyGraphWithStateType> = props => {


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

                if ( coord < props.display.reference!.from )
                    props.display.setReference( {
                        from: coord,
                        to: props.display.reference!.to
                    } );
                else {
                    props.display.setReference( {
                        from: props.display.reference!.from,
                        to: coord
                    } );
                }

            }
        }

    }, [isHovering, setIsHovering, props.display.reference ] );

    const onMouseLeave: CategoricalChartFunc = useCallback( () => {
        setIsHovering( false );
        setIsSelecting( false );
    }, [ isHovering, isSelecting ] );


    const onDown: CategoricalChartFunc = useCallback( event => {


        if ( event.activeLabel ) {

            if ( !isSelecting ) {

                setIsSelecting( true );

                const value = parseInt( event.activeLabel );
                props.display.setReference({
                    from: value,
                    to: value
                });

            }

        }


    }, [ props.display.reference, isSelecting ] );

    const onUp: CategoricalChartFunc = event => {

        if ( event.activeLabel ) {

            if ( isSelecting ) {
                setIsSelecting( false );
                onSelectionComplete();
            }

        }

        if ( props.display.reference ) {

            if ( props.display.reference.from === props.display.reference.to )
                props.display.setReference( undefined );
        }

    }


    const onSelectionComplete = () => {

        if ( props.display.tool === Tool.SELECT ) {}
        else if ( props.display.tool === Tool.ZOOM ) {

            if ( props.display.reference ) {
                props.filter.setFrom( stringFromTimestampFrom( props.display.reference.from ) );
                props.filter.setTo( stringFromTimestampTo( props.display.reference.to ) );
            }

        }

    }


    return <div className="relative">
        <ResponsiveContainer
            width={"100%"}
            height={props.display.height}
        >
            <ComposedChart
                data={props.data.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseDown={onDown}
                onMouseUp={onUp}
            >

                <CartesianGrid />

                {props.display.reference && 
                    <ReferenceArea
                        x1={props.display.reference.from}
                        x2={props.display.reference.to}
                        strokeOpacity={0.3}
                    />
                }

                {props.data.lines.map( src => {

                    return <Line 
                        key={src.slug}
                        dataKey={src.slug}
                        unit={props.property.unit ?? ""}
                        dot={false}
                        stroke={src.stroke}
                        isAnimationActive={false}
                    />
                    
                } ) }

                {props.data.dots.map( src => {

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
                    unit={props.property.unit} 
                    domain={domain as any}
                />

                <Tooltip
                    formatter={(value: number, name) => {
                        return [value.toFixed(3), props.data.labels[name] ?? name];
                    }}
                    labelFormatter={(value) => {
                        return format(new Date(value), "d. M. Y H:mm");
                    }}
                    isAnimationActive={false}
                />

            </ComposedChart>

        </ResponsiveContainer>

        {props.apiData.loading && <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <Spinner size="lg" color="default"/>
        </div>}
    </div>
}