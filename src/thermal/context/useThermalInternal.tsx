"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { ThermalStorageType, thermalStorageDefaults } from "./reducerInternals/storage";
import ThermalActionsFactory, { AvailableThermalActions, ThermalActions } from "./reducerInternals/actions";
import { thermalReducer } from "./reducerInternals/reducer";
import { ThermalLoader } from "@/thermal/reader/thermalLoader";
import ThermalFile from "../reader/thermalFile";

type LoadedThermalImagesType = {
    [index:string]: string
}

type ThermalFileRequestType = {
    [index:string]: {
        url: string,
        file?: ThermalFile|undefined
    }
}

export const useThermalInternal = () => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ThermalStorageType, AvailableThermalActions>>( thermalReducer, thermalStorageDefaults );

    const [ requests, setRequests ] = useState<ThermalFileRequestType>({});

    const addRequest = useCallback( ( requestId: string, url: string ) => {
        setRequests( prev => ({
            ...prev, 
            [requestId]:{url: url}
        }) );
    }, [setRequests] );


    const resolveRequest = useCallback( ( requestId: string, file: ThermalFile ) => {
        setRequests( prev => ({
            ...prev,
            [requestId]: {
                url: file.url,
                file: file
            }
        }) );
    }, [ setRequests ] );



    useEffect( () => {

        const load = async ( requestId: string, url: string ) => {

            const file = await ThermalLoader.fromUrl( url );
            if ( file ) {
                dispatch( ThermalActionsFactory.addFile( file ) );
                resolveRequest( requestId, file );
            }

        }

        Object.entries( requests ).forEach( ([key,value])=> {

            if ( value.file === undefined ) {
                load( key, value.url );
            }

        } );

    }, [ requests, resolveRequest ] ); // eslint-disable-line react-hooks/exhaustive-deps


    // 


    const loadFile = useCallback( ( requestId: string, url: string ) => {

        if ( Object.keys( requests ).includes( requestId ) === false ) {
            addRequest( requestId, url );
        }

    }, [ requests, setRequests ]);

    const removeFile = useCallback( ( id: string ) => {

            dispatch( ThermalActionsFactory.removeFileById( id ) )

    }, [ dispatch ]);

    return {
        state,
        dispatch,
        loadFile,
        removeFile,
        requests: requests
    }

}

export type UseThermalInternalReturnValue = ReturnType< typeof useThermalInternal >;

export const useThermalInternalDefault: UseThermalInternalReturnValue = {
    state: thermalStorageDefaults,
    dispatch: () => {},
    loadFile: async (url) => {},
    removeFile: () => {},
    requests: {}
}