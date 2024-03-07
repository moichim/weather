"use client";

import { useEffect, useState } from "react";
import { CursorEvent, MinmaxEvent, OpacityEvent, RangeEvent, ThermalEvents } from "../registry/events";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "../registry/interfaces";
import { useGroupInstance } from "./useGroupInstance";


export const useGroupListener = (
    groupId: string
) => {

    const [opacity, setOpacity] = useState<number>(1);
    const [range, setRange] = useState<ThermalRangeOrUndefined>(undefined);
    const [minmax, setMinmax] = useState<ThermalMinmaxOrUndefined>(undefined);
    const [ cursor, setCursor ] = useState<ThermalCursorPositionOrundefined>(undefined)

    const group = useGroupInstance( groupId );


    useEffect( () => {

        // Add bindings


        // Opacity
        const opacityListener = (evt: Event) => {
            const e = event as OpacityEvent;
            setOpacity(e.detail.opacity);
        }

        group.addEventListener(ThermalEvents.OPACITY_UPDATED, opacityListener);


        // Range
        const rangeListener = (evt: Event) => {
            
            const e = evt as RangeEvent;
            setRange(e.detail.range);
        }

        group.addEventListener( ThermalEvents.RANGE_UPDATED, rangeListener );


        // Min max
        const minmaxListener = ( evt: Event ) => {
            const e = evt as MinmaxEvent;
            setMinmax( e.detail.minmax );
        }

        group.addEventListener( ThermalEvents.MINMAX_UPDATED, minmaxListener );

        // Cursor
        const cursorListener = ( evt: Event ) => {
            const e = evt as CursorEvent;
            setCursor( e.detail.cursorPosition );

        }
        group.addEventListener( ThermalEvents.CURSOR_UPDATED, cursorListener );

        return () => {
            group.removeEventListener( ThermalEvents.OPACITY_UPDATED, opacityListener );
            group.removeEventListener( ThermalEvents.RANGE_UPDATED, rangeListener );
            group.removeEventListener( ThermalEvents.MINMAX_UPDATED, minmaxListener );
            group.removeEventListener( ThermalEvents.CURSOR_UPDATED, cursorListener );
        }


    }, [ group, setRange, setOpacity, setMinmax, setCursor ] );



    useEffect( () => {

        if ( opacity !== group.opacity ) {

            group.recieveOpacity( opacity );

        }

    }, [ group, opacity ] );

    useEffect( () => {

        if ( group.range === undefined && range !== undefined ) {
            group.recieveRange( range );
        } else if ( group.range === undefined && range === undefined ) {

        } else if ( group.range !== undefined && range !== undefined ) {
            if (
                group.range.from !== range.from
                || group.range.to !== range.to
            ) {
                group.recieveRange( range );
            }
        }

    }, [ group, range ] );

    return {
        opacity, setOpacity,
        range, setRange,
        minmax,
        cursor
    }

}