"use client";

import { ThermalFileInstance, UserInteractionEvent } from "@/thermal/reader/ThermalFileInstance";
import { RefObject, useEffect, useState } from "react";
import { useThermoGroupObserver } from "./useThermoGroupObserver";

export const useThermoInstanceObserver = (
    instance: ThermalFileInstance,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const [value, setValue] = useState<number | undefined>();
    const [hover, setHover] = useState<boolean>( false );

    const { state, setCursor } = useThermoGroupObserver( instance.groupId );

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
        const onUserInteract = (e: Event) => {

            const event = e as UserInteractionEvent

            // Update the global cursor
            if ( state.cursorX !== event.target.cursorX || state.cursorY !== event.target.cursorY) {
                if ( event.target.cursorX !== undefined && event.target.cursorY !== undefined ) {
                    setCursor( {x:event.target.cursorX,y:event.target.cursorY} );
                } else {
                    setCursor( {x:undefined,y:undefined} );
                } 
            }

            // Update the instance value
            if ( value !== event.target.cursorValue ) {
                setValue( event.target.cursorValue );
            }

            if ( hover === false && event.target.hover === true ) {
                setHover( true );
            }

            if ( hover === true && event.target.hover === false ) {
                setCursor( {x:undefined,y:undefined} );
                setValue( undefined );
                setHover( false );
            }



        }

        instance.addEventListener( "userinteraction", onUserInteract );
        

        return () => {
            instance.removeEventListener( "userinteraction", onUserInteract );
        }

    }, [hover, value] );

    useEffect( () => {

        const onChangedByGod = ( e: Event ) => {
            const event = e as UserInteractionEvent;

            if ( value !== event.target.cursorValue ) {
                setValue( event.target.cursorValue );
            }

        }

        instance.addEventListener( "godinteraction", onChangedByGod );

        return () => instance.removeEventListener( "godinteraction", onChangedByGod );

    }, [value] );


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