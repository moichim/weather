import { useReducer, Reducer, useEffect, useState, useCallback } from "react"
import { ThermoStorageType, thermoStorageFactory } from "../context/reducerInternals/storage"
import { AvailableThermoActions, ThermoActionsFactory } from "../context/reducerInternals/actions"
import { theRehookReducer } from "../context/reducerInternals/reducer";
import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource";
import { ThermalLoader } from "@/thermal/parsers/thermalLoader";

/** A hook used in the global context.
 * - handles loading internally
 * - exposes functions for loading
 * - exposes functions for setting reducer values @todo
 */
export const useThermoContextInternal = () => {

    const [
        state,
        dispatch
    ] = useReducer< Reducer<ThermoStorageType, AvailableThermoActions > >( theRehookReducer, thermoStorageFactory() );

    const [loading, setLoading] = useState<{[index:string]:string[]}>({});
    const [pending, setPending] = useState<string[]>([]);
    const [loaded, setLoaded] = useState<{[index:string]:ThermalFileSource}>({});

    const startLoadingFile = useCallback( ( url:string, group:string ) => {

        // If the file is already registered, create a new instance in the group
        if ( state.sourcesByPath[url] !== undefined ) {

            dispatch( ThermoActionsFactory.instantiateFile( url, group ) );
            return;

        }

        // ... otherwise register this file in a buffer
        setLoading( prev => {

            // If the url is already loading...
            if ( Object.keys( prev ).includes( url ) ) {
                // ... add the group to its subscribers
                const newLoading = {...prev};
                if ( ! newLoading[url].includes(group) ) {
                    newLoading[url] =[...newLoading[url],group];
                    return newLoading;
                } else {
                    return prev;
                }
                
            }

            // If the file is not loading yet, add it to loading
            return {...prev,[url]: [group]}

        } );

    }, [ loading, state, dispatch ] );

    const startLoadingFiles = useCallback( ( urls: string[], group: string ) => {

        urls.forEach( url => startLoadingFile( url, group ) )

    }, [ startLoadingFile ] );

    // Whenever loading array changes, iterate its content and trigger loading
    useEffect( () => {

        // Iterate all loading and start loading those who are not already
        Object.entries( loading ).forEach( ([url,subscribers]) => {

            if ( ! pending.includes( url ) ) {

                // Add this file to the pending requests
                setPending( prev => {
                    if ( prev.includes(url) ) return prev;
                    return [...prev,url]
                } );

                // Load the file
                const load = async ( url:string ) => {
                    const file = await ThermalLoader.fromUrl( url );
                    if ( file ) {
                        // Set the file loaded
                        setLoaded( prev => {
                            if ( prev[url] === undefined ) {
                                return {...prev,[url]:file}
                            }
                            return prev;
                        } );
                    }
                }

                load( url );

            }

        } );

    }, [loading, pending, setLoading, setPending, setLoaded] );


    useEffect( () => {


        Object.entries( loaded ).forEach( ([url,file]) => {

            // Remove the file from the loaded
            setLoaded( prev => {
                if ( prev[url] !== undefined ) {
                    const {[url]:_,...newLoaded} = prev;
                    return newLoaded;
                }
                return prev;
            } );

            // Register a loaded file
            dispatch( ThermoActionsFactory.registerLoadedSource( file, loading[file.url] ) );

            // Remove the success from the pending
            setPending( prev => {
                return prev.filter( item => item !== url );
            } );
            // Remove the success from the loading
            setLoading( prev => {
                const { [url]:_, ...rest } = prev   
                return rest;
            } );

        } );

    }, [loaded] );

    return {
        startLoadingFile,
        startLoadingFiles,
        state,
        dispatch
    }

}

export type UseThermoContextInternalType = ReturnType<typeof useThermoContextInternal>;

export const useThermoContextDefaults: UseThermoContextInternalType = {
    state: thermoStorageFactory(),
    dispatch: () => {},
    startLoadingFile: () => {},
    startLoadingFiles: () => {}
}