import { useReducer, Reducer, useEffect, useState, useCallback } from "react"
import { ThermoStorageType, thermoStorageFactory } from "./storage"
import { AvailableThermoActions, ThermoActionsFactory } from "./actions"
import { theRehookReducer } from "./reducer";

export const useRehook = () => {

    const [
        state,
        dispatch
    ] = useReducer< Reducer<ThermoStorageType, AvailableThermoActions > >( theRehookReducer, thermoStorageFactory() );

    const startLoadingFile = useCallback( ( url:string, group:string ) => {

        dispatch( ThermoActionsFactory.groupLoadFile( group, url ) );

    }, [ state.loading ] );

    // Once a file is added to loading images, 
    useEffect( () => {

        // Every file that is in loading and not in loaded should start loading immediately

        // Every file that is amongst the loading and the loaded should be processed at once


    }, [ state.loading, state.loaded ] );

}