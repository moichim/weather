"use client";

import { useEffect, useState } from "react";
import { MinmaxEvent, OpacityEvent, RangeEvent, ThermalEvents } from "../registry/events";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "../registry/interfaces";
import { useRegistryContext } from "./RegistryContext";

/**
 * Binds the registry properties
 */
export const useRegistryListener = () => {

    const [opacity, setOpacity] = useState<number>(1);
    const [range, setRange] = useState<ThermalRangeOrUndefined>(undefined);
    const [minmax, setMinmax] = useState<ThermalMinmaxOrUndefined>(undefined);
    const [ready, setReady] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

    const registry = useRegistryContext();

    useEffect(() => {

        // Add bindings


        // Opacity
        const opacityListener = (evt: Event) => {
            const e = event as OpacityEvent;
            setOpacity(e.detail.opacity);
        }

        registry.addEventListener(ThermalEvents.OPACITY_UPDATED, opacityListener);


        // Range
        const rangeListener = (evt: Event) => {
            const e = evt as RangeEvent;
            setRange(e.detail.range);
        }

        registry.addEventListener(ThermalEvents.RANGE_UPDATED, rangeListener);


        // Min max
        const minmaxListener = (evt: Event) => {
            const e = evt as MinmaxEvent;
            setMinmax(e.detail.minmax);
        }

        registry.addEventListener(ThermalEvents.MINMAX_UPDATED, minmaxListener);

        // Initialiser
        const initialiser = (evt: Event) => {
            console.info( "Vše je ready" );
            setReady( prev => {
                return true
            } );
            setCount( prev => {
                return prev + 1;
            } );
        }
        registry.addEventListener( ThermalEvents.READY, initialiser );

        const loaderStartListener = ( evt: Event ) => {
            setReady( prev => {
                return false
             } );
            setCount( prev => {
                return prev + 1; 
            });
        }

        registry.addEventListener( ThermalEvents.GROUP_LOADING_START, loaderStartListener );

        return () => {
            registry.removeEventListener(ThermalEvents.OPACITY_UPDATED, opacityListener);
            registry.removeEventListener(ThermalEvents.RANGE_UPDATED, rangeListener);
            registry.removeEventListener(ThermalEvents.MINMAX_UPDATED, minmaxListener);
            registry.removeEventListener( ThermalEvents.READY, initialiser );
            registry.removeEventListener( ThermalEvents.GROUP_LOADING_START, loaderStartListener );
        }


    }, [registry, setRange, setOpacity, setMinmax, count, setReady, setCount, ready]);

    useEffect( () => {

        console.log( "registr změnil stav ready na", ready );

        if (ready === false) {
            registry
            return;
        }

        const timeout = setTimeout( () => {
            Object.values( registry.groups ).forEach( group => {
                group.getInstancesArray().forEach( instance => {
                    instance.recieveActivationStatus( true )
                } );
            } );
        }, 20 );

        return () => clearTimeout( timeout );

    }, [ready, setReady, registry, count] );

    useEffect(() => {

        if (opacity !== registry.opacity) {

            registry.imposeOpacity(opacity);

        }

    }, [registry, opacity]);

    useEffect(() => {

        if (registry.range === undefined && range !== undefined) {
            registry.imposeRange(range);
        } else if (registry.range === undefined && range === undefined) {

        } else if (registry.range !== undefined && range !== undefined) {
            if (
                registry.range.from !== range.from
                || registry.range.to !== range.to
            ) {
                registry.imposeRange(range);
            }
        }

    }, [registry, range]);

    return {
        range, setRange,
        opacity, setOpacity,
        minmax,
        ready,
        registry
    }
}