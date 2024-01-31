"use client";

import { useEffect, useState } from "react";
import LrcReader from "./lrcReader";
import ThermalFile from "./thermalFile";

/** Load an external LRC, convert it and return ince it is loaded */
export const useLrc = ( absoluteUrl: string ) => {

    const [file,setFile] = useState<ThermalFile|null>( null );

    useEffect( () => {

        const getFile = async () => {
            const file = await LrcReader.fromUrl(absoluteUrl);
            if ( file !== null ) {
                setFile( file );
            }
        }

        getFile();
    }, [absoluteUrl] );

    return file;

}