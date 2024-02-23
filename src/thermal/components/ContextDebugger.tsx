"use client"

import { useMemo, useState } from "react";
import { useThermoContext } from "../context/thermoContext";
import { ThermalGroup } from "./group/ThermalGroup";
import { ThermalScale } from "./group/internals/ThermalScale";
import { SliderValue } from "@nextui-org/react";
import { ThermoActionsFactory } from "../context/reducerInternals/actions";

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

    const { state, dispatch } = useThermoContext();


    return <>

        <ThermalScale 
        
            min={state.min ?? -1}
            max={state.max ?? 1}
            from={state.from ?? 0}
            to={state.to ?? 0}
            onChange={ (data:SliderValue) => {
                if ( Array.isArray( data ) )
                    dispatch( ThermoActionsFactory.globalSetRange( {from: data[0], to: data[1]} ) )
            } }
        
        />

        {Object.entries( groups ).map( ([key,urls]) => <ThermalGroup key={key} name={key} urls={urls} /> )}
    </>

}