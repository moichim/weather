"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { RangeEvent, ThermalEvents } from "@/thermal/registry/events";
import { ThermalRangeOrUndefined } from "@/thermal/registry/interfaces";
import { useCallback, useEffect, useState } from "react";

export const useThermalRange = (
    target: undefined|ThermalRegistry|ThermalGroup|ThermalFileInstance
) => {

    const [range, setRange] = useState<ThermalRangeOrUndefined>(undefined);

    useEffect( () => {

        const rangeListener = ( evt: Event ) => {
            const event = evt as RangeEvent;
            setRange( event.detail.range );
        }

        target?.addEventListener( ThermalEvents.RANGE_UPDATED, rangeListener );

        return () => target?.removeEventListener( ThermalEvents.RANGE_UPDATED, rangeListener );

    }, [ target, range, setRange ] );

    const imposeGlobalRange = useCallback( ( value: ThermalRangeOrUndefined ) => {

        if ( target instanceof ThermalRegistry ) {
            target.imposeRange( value );
        } else if ( target instanceof ThermalGroup ) {
            target.registry.imposeRange( value );
        } else if ( target instanceof ThermalFileInstance ) {
            target.group.registry.imposeRange( value );
        }


    }, [ target ] );

    return {
        target,
        range,
        imposeRange: imposeGlobalRange
    }

}
