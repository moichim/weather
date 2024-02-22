"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useThermoContext } from "../context/thermoContext";
import { CursorSetterType, ThermoActionsFactory } from "../context/reducerInternals/actions";

export const useThermoGroupLoader = ( groupId: string ) => {

    // The ID is immutable.
    const id = useMemo( () => groupId, [] );

    // Register the ID
    useEffect( () => {
        dispatch( ThermoActionsFactory.grouplInit( id ) );
    }, [id] );

    const {
        state: globalState,
        dispatch,
        startLoadingFile,
        startLoadingFiles,
    } = useThermoContext();

    
    const loadFile = useCallback( ( url: string ) => {
        startLoadingFile( url, id );
    },[startLoadingFile, id] );

    const loadFiles = useCallback( ( urls: string[] ) => {
        startLoadingFiles( urls, id );
    }, [startLoadingFiles, id] );


    const state = useMemo( () => {
        return globalState.groups[ id ];
    }, [ globalState.groups, id ] );

    return {
        state,
        loadFile,
        loadFiles
    }

}