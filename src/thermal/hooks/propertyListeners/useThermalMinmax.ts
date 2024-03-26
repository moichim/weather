"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { MinmaxEvent, ThermalEvents } from "@/thermal/registry/events";
import { ThermalMinmaxOrUndefined } from "@/thermal/registry/interfaces";
import { useEffect, useState } from "react";

export const useThermalMinmax = (
    target: undefined|ThermalRegistry|ThermalGroup|ThermalFileInstance
) => {

    const [minmax, setMinmax] = useState<ThermalMinmaxOrUndefined>(undefined);

    useEffect( () => {

        const minmaxListener = ( evt: Event ) => {
            const e = evt as MinmaxEvent;
            setMinmax( e.detail.minmax );
        }

        target?.addEventListener( ThermalEvents.MINMAX_UPDATED, minmaxListener );

        return () => target?.removeEventListener( ThermalEvents.MINMAX_UPDATED, minmaxListener );

    }, [ target, minmax, setMinmax ] );

    console.log( minmax, target );

    return {
        minmax,
        target
    }

}