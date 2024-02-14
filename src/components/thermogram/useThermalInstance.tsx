import ThermalFile from "@/utils/reader/thermalFile";
import { useCallback, useState } from "react";

export const useThermalInstance = (
    file: ThermalFile | undefined = undefined
) => {


    const [ observer, setObserver ] = useState<ThermalFile>();

    const setContainer = useCallback( ( container: HTMLDivElement ) => {

        if ( file ) {
            file.bind( container );

            const proxy = new Proxy( file, {
                get( target, prop, reciever ) {
                    if ( prop === "cursorX" ) {
                        console.log( "xyz!!!", target );
                        return target.cursorX;
                    }
                    if ( prop === "cursorY" ) {
                        return target.cursorY;
                    }
                    if ( prop === "cursorValue" ) {
                        return target.cursorValue;
                    }
                }
            } );

            setObserver( proxy );

        }

    }, [file] );

    return {
        file,
        setContainer,
        observer
    }

}