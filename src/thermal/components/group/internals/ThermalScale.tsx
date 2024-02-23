"use client";

import { Slider, SliderValue, cn } from "@nextui-org/react";
import { DOMAttributes, useCallback, useEffect, useMemo, useState } from "react";

type ThermalScaleProps = {
    label?: React.ReactNode,
    step?: number,
    min: number,
    max: number,
    from: number,
    to: number,
    scaleOffset?: number,
    onChange: ( value: SliderValue ) => void
}

export const ThermalScale: React.FC<ThermalScaleProps> = ({
    label = "Teplotní škála",
    step = 1,
    scaleOffset = 2,
    ...props
}) => {

    // DOMAttributes<HTMLDivElement> & {index?: number}) => ReactNode	A function to render the thumbs. The 

    const renderThumb = useCallback((
        props: DOMAttributes<HTMLDivElement> & { index?: number }
    ) => {

        const bg = props.index === 0
            ? "bg-black"
            : "bg-white";
        return (<div
            {...props}
            className={"group p-1 top-1/2 bg-gray-700 border-tiny border-default-200 rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"}
        >
            <span className={cn("transition-transform rounded-full w-6 h-6 block group-data-[dragging=true]:scale-80", bg)} />
        </div>)
    }, []);

    const min = useMemo( () =>Math.floor( props.min ) - scaleOffset, [props.min, scaleOffset] );

    const max = useMemo( () =>Math.ceil( props.max ) + scaleOffset, [props.max, scaleOffset] );

    const [value, setValue] = useState<[number,number]>( [ props.min, props.max ] );

    useEffect( () => {
        const timeout = setTimeout( () => {
            if ( props.from !== value[0] || props.to !== value[1] ) 
            props.onChange( value )
        }, 100 );
        return () => clearTimeout( timeout );
    }, [value] );

    useEffect( () => {

        // const timeout = setTimeout( () => {
            if ( props.from !== value[0] || props.to !== value[1] ) {
                setValue( [props.from, props.to] );
            }
        // }, 1 );
        
        //return () => clearTimeout( timeout );
    }, [props.from, props.to] );

    console.log( label, value );

    return <Slider
        label={label}

        minValue={min}
        maxValue={max}
        defaultValue={[min, max]}
        value={value}
        onChange={(data:SliderValue) => {
            if (Array.isArray( data ))
                setValue(data as [number,number])
        }}

        showTooltip={true}
        showSteps={true}
        step={step}

        color="foreground"
        classNames={{
            base: "px-1",
            mark: "bg-black",
            track: "bg-gray-400 h-6",
            filler: "thermal-scale-gradient"
        }}
        renderThumb={renderThumb}
    />

}