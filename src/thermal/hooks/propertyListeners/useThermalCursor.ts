"use client";

import { useEffect, useState } from "react";
import { ThermalFileInstance } from "../../file/ThermalFileInstance";
import { ThermalGroup } from "../../registry/ThermalGroup";
import { ThermalCursorPositionOrundefined } from "../../registry/interfaces";
import { CursorEvent, ThermalEvents } from "../../registry/events";

export const useThermalCursor = (
    target: undefined | ThermalGroup | ThermalFileInstance
) => {

    const [ position, setPosition ] = useState<ThermalCursorPositionOrundefined>( undefined );
    const [value, setValue] = useState<number|undefined>( undefined );
    const [ hover, setHover ] = useState<boolean>( false );

    useEffect( () => {

        const cursorListener = ( evt: Event ) => {
            const e = evt as CursorEvent;

            const ePos = e.detail.cursorPosition;

            if ( position === undefined && ePos === undefined ) {

                if ( hover ) setHover( false );
                if ( ePos !== undefined ) setValue( ePos );

            } else if ( position === undefined && ePos !== undefined ) {

                setPosition( ePos );
                setValue( e.detail.cursorValue );

            } else if ( position !== undefined && ePos !== undefined ) {

                if (  
                    ePos.x !== position.x
                    || ePos.y !== position.y
                ) {
                    setPosition( { x: ePos.x, y: ePos.y } );
                }

                if ( e.detail.cursorValue !== value ) {
                    setValue( e.detail.cursorValue );
                }

                if ( e.detail.isHover !== hover ) {
                    setHover( e.detail.isHover );
                }

            }

        }

        target?.addEventListener( ThermalEvents.CURSOR_UPDATED, cursorListener );

        return () => target?.removeEventListener( ThermalEvents.CURSOR_UPDATED, cursorListener );


    }, [ target, position, setPosition, value, setValue, hover, setHover ] );

    return {
        position,
        value,
        hover,
        target
    }

}

