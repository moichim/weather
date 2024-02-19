"use client"

import { useEffect, useReducer } from "react"
import { ThermalStorageNew, thermalStorageNewDefaults } from "./reducerUpdated/storage"
import { AvailableThermalActions, ThermalActionsNewFactory } from "./reducerUpdated/actions"
import { thermalReducerNew } from "./reducerUpdated/reducer";
import { ThermalLoader } from "../reader/thermalLoader";
import { ThermalActions } from "./reducerInternals/actions";

export const useThermalContextNewInternal = () => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ThermalStorageNew, AvailableThermalActions>>( thermalReducerNew, thermalStorageNewDefaults );


    // Add newly assigned requests to pending
    useEffect( () => {

        const startFileLoading = async ( url: string ) => {

            const file = await ThermalLoader.fromUrl( url );

            if ( file ) {
                console.log( "Načten soubor", file );
                dispatch( ThermalActionsNewFactory.globalLoadFileSuccess( url, file ) );
            }

        }

        console.log("wtf", state.requestsFiredByUrl);

        Object.keys( state.requestsFiredByUrl ).forEach( (url) => {

            dispatch( ThermalActionsNewFactory.globalLoadFileSetPending( url ) );

            console.log( "requestsFiredByUrlChanged", state );
            startFileLoading( url );
        } );

    }, [state.requestsFiredByUrl, dispatch] );


    return {
        state,
        dispatch
    }

}

export type UseThermalContextNewType = ReturnType< typeof useThermalContextNewInternal >;

export const useThermalContextDefaults: UseThermalContextNewType = {
    state: thermalStorageNewDefaults,
    dispatch: () => {}
}