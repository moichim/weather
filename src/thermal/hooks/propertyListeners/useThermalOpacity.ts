"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { OpacityEvent, ThermalEvents } from "@/thermal/registry/events";
import { useCallback, useEffect, useState } from "react";

export const useThermalOpacity = (
    target: undefined|ThermalRegistry|ThermalGroup|ThermalFileInstance
) => {

    const [opacity, setOpacity] = useState<number>(1);

    useEffect( () => {

        const opacityListener = ( evt: Event ) => {
            const event = evt as OpacityEvent;
            setOpacity( event.detail.opacity );
        }

        target?.addEventListener( ThermalEvents.OPACITY_UPDATED, opacityListener );

        return () => target?.removeEventListener( ThermalEvents.OPACITY_UPDATED, opacityListener );

    }, [ target, opacity, setOpacity ] );

    const imposeGlobalOpacity = useCallback( ( value: number ) => {

        value = Math.min( Math.max( value, 1 ), 0 );

        if ( target instanceof ThermalRegistry ) {
            target.imposeOpacity( value );
        } else if ( target instanceof ThermalGroup ) {
            target.registry.imposeOpacity( value );
        } else if ( target instanceof ThermalFileInstance ) {
            target.group.registry.imposeOpacity( value );
        }


    }, [ target ] );

    return {
        target,
        opacity,
        imposeGlobalOpacity
    }

}
