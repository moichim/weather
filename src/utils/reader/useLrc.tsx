"use client";

import { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import LrcParser from "./lrcParser";
import ThermalFile from "./thermalFile";
import { ThermalLoader } from "./thermalLoader";

export const useLrcObserver = (
    file: ThermalFile
) => {

    console.log("Mám tu observer");

    const [x, setX] = useState<number | undefined>();
    const [y, setY] = useState<number | undefined>();
    const [value, setValue] = useState<number | undefined>();

    useEffect(() => {

        console.log(file);


        if (file.cursorX !== x)
            setX(file.cursorX);

        if (file.cursorY !== y)
            setY(file.cursorY);

        if (file.cursorValue !== value)
            setValue(file.cursorValue);

    }, [
        file,
        file.cursorX,
        file.cursorY,
        file.cursorX,
        file.cursorValue
    ]);

    return {
        x,
        y,
        value
    }


}

/** Load an external LRC, convert it and return ince it is loaded */
export const useLrcCanvas = (absoluteUrl: string) => {

    // const [file, setFile] = useState<ThermalFile | null>(null);

    const ref = useRef<{
        file: ThermalFile | undefined
    }>({
        file: undefined
    });



    const setContainer = useCallback((container: HTMLDivElement) => {

        if (ref.current.file) {
            ref.current.file.bind(container);
            ref.current.file.initialise();
        }

    }, [ref.current.file]);

    /*
    const getFile = useCallback(async () => {

        if (ref.current.file === undefined) {

            const result = await ThermalLoader.fromUrl(absoluteUrl);

            if (result !== null) {
                ref.current.file = result;
            }

        }



    }, [ref.current.file]);

    */

    // initial load
    useEffect(() => {

        if (ref.current.file === undefined) {
            // return;
        }

        const getFile = async () => {

            const result = await ThermalLoader.fromUrl(absoluteUrl);

            if (result !== null) {
                ref.current.file = result;
            }

        }


        getFile();

    }, [absoluteUrl, ref.current.file]);


    return {
        file: ref.current.file,
        setContainer
    };

}