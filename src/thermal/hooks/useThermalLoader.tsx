"use client";

import { RefObject, useEffect, useMemo, useState } from "react";
import ThermalFile from "../reader/thermalFile";
import { useThermalContext } from "../context/thermalContext";
import {v4 as uuidv4} from 'uuid';

/** Handles loading of a file through the `ThermalContext` */
export const useThermalLoader = (
    url: string,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const [ file, setFile ] = useState<ThermalFile|undefined>();

    const id = useMemo( () => uuidv4(), [] );

    const context = useThermalContext();

    // Trigger loading of the file
    useEffect( () => {
        context.loadFile( id, url );
    }, [ url ] ); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect( () => {

        if ( context.requests[ id ] !== undefined ) {
            if ( context.requests[ id ].file !== undefined ) {
                setFile( context.requests[ id ].file );
            }
        }

    }, [context.requests, id] );

    // Once the file is loaded and stored locally, initialise it
    useEffect( () => {
        if ( file && renderingContainer.current ) {
            file.bind( renderingContainer.current );
            file.initialise();
        }
    }, [file, renderingContainer] );

    return file;

}