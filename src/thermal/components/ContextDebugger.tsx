"use client"

import { useMemo, useState } from "react";
import { useThermoContext } from "../context/thermoContext";
import { ThermalGroup } from "./group/ThermalGroup";

export const ContextDebugger: React.FC = () => {

    const groups = useMemo( () => {

        const max = 10;

        const groups = {
            a: [] as string[],
            b: [] as string[],
            c: [] as string[]
        }

        for ( let i = 1; i <= max; i++ ) {
            groups.a.push( `/samples/${i}/a.lrc` );
            groups.b.push( `/samples/${i}/b.lrc` );
            groups.c.push( `/samples/${i}/c.lrc` );
        }

        return groups;

    }, [] );


    return <>

        {Object.entries( groups ).map( ([key,urls]) => <ThermalGroup key={key} name={key} urls={urls} /> )}
    </>

}