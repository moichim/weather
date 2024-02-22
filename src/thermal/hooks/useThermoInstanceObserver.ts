"use client";

import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance";
import { RefObject, useEffect, useState } from "react";
import { useThermoGroupObserver } from "./useThermoGroupObserver";

export const useThermoInstanceObserver = (
    instance: ThermalFileInstance,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const [x, setX] = useState<number | undefined>();
    const [y, setY] = useState<number | undefined>();
    const [value, setValue] = useState<number | undefined>();
    const [hover, setHover] = useState<boolean>( false );

    const { state, setCursor } = useThermoGroupObserver( instance.groupId );



    // Capture changes of the DOM and mirror it to the local state
    useEffect( () => {

        // Do nothing when the reference is not set
        if ( renderingContainer.current === null )
            return;

        const container = renderingContainer.current;

        // If the instance is not binded yet, do so!
        if ( container.dataset.binded === undefined ) {
            instance.bind( container );
            instance.initialise();
        }

        const observer = new MutationObserver((mutations) => {

            const mutationsProperties = mutations.map( mutation => mutation.attributeName );

            console.log( mutationsProperties );

            if ( mutationsProperties.includes( "data-hover" ) ) {
                setHover( instance.hover );
            }

            const newCursor = instance.cursorX !== undefined && instance.cursorY !== undefined
                ? {x:instance.cursorX, y: instance.cursorY}
                : {x:undefined, y: undefined};



            setCursor( newCursor );
            setValue( instance.cursorValue );

            return;

        });

        if (renderingContainer.current) {
            observer.observe(renderingContainer.current, { attributes: true });
        }

        return () => observer.disconnect();


    }, [renderingContainer] );

    // Mirror local cursor state to the global one
    /*
    useEffect( () => {

        // if ( hover === true ) {
            if ( x !== undefined && y !== undefined ) {
                // setCursor( {x,y} );
            } else {
                // setCursor( {x:undefined,y:undefined} );
            }
        // }

    }, [x,y, hover, setCursor] );
    */


    return {
        x: state.cursorX,
        y: state.cursorY,
        value,
        hover,
        labelStyle: state.cursorLabelStyle,
        mirrorX: state.mirrorX,
        mirrorY: state.mirrorY
    }

}

export type UseThermoInstanceType = ReturnType< typeof useThermoInstanceObserver >;