"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { ThermalStorageType, thermalStorageDefaults } from "./reducerInternals/storage";
import ThermalActionsFactory, { AvailableThermalActions, ThermalActions } from "./reducerInternals/actions";
import { thermalReducer } from "./reducerInternals/reducer";
import { ThermalLoader } from "@/utils/reader/thermalLoader";

export const useThermalInternal = () => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ThermalStorageType, AvailableThermalActions>>( thermalReducer, thermalStorageDefaults );

    const [loading, setLoading] = useState<string[]>([]);
    const [pending, setPending] = useState<string[]>([]);

    const loadFile = useCallback( ( url: string ) => {

        if ( ! loading.includes( url ) ) {
            
            setLoading( prev => [ ...prev, url ].reduce( (state,current) => {
                if ( ! state.includes( current ) ) {
                    return [...state,current];
                }
                return [...state]
            }, [] as string[] ) );

        }

    }, [ loading, setLoading ]);

    useEffect( () => {

        const load = async ( url: string ) => {

            const file = await ThermalLoader.fromUrl( url );
            if ( file ) {
                dispatch( ThermalActionsFactory.addFile( file ) );
                setPending( prev => prev.filter( i => i !== url ) );
            }
        }

        loading.forEach( url => {

            if ( ! pending.includes( url ) ) {
                setPending( prev => [...prev, url] );
                setLoading( prev => prev.filter( l => l !== url ) );
                load( url )
            }

        } );

    }, [loading, setLoading] );


    useEffect( () => console.log( "loading", loading ), [loading] );
    useEffect( () => console.log( "pending", pending ), [pending] );

    const removeFile = useCallback( ( id: string ) => {

            dispatch( ThermalActionsFactory.removeFile( id ) )


    }, [ dispatch ]);

    return {
        state,
        loadFile,
        removeFile
    }

}

export type UseThermalInternalReturnValue = ReturnType< typeof useThermalInternal >;

export const useThermalInternalDefault: UseThermalInternalReturnValue = {
    state: thermalStorageDefaults,
    loadFile: async (url) => {},
    removeFile: () => {}
}