"use client"

import { useEffect, useState } from "react";
import { ThermalNGroup } from "./group/ThermalNgroup";
import { useThermoContext } from "../context/thermoContext";

export const ContextDebugger: React.FC = () => {

    const context = useThermoContext();

    const [ secondGroupUrls, setSecondGroupUrls ] = useState<string[]>( [] );

    useEffect( () => {

        const timeout = setTimeout( () => setSecondGroupUrls( ["/sample.lrc","/sample3.lrc"] ), 1000 );

        return () => clearTimeout( timeout );

    }, [] );

    useEffect( () => {

        const timeout = setTimeout( () => setSecondGroupUrls( ["/sample.lrc","/sample2.lrc", "/sample3.lrc"] ), 5000 );

        return () => clearTimeout( timeout );

    }, [] );


    useEffect( () => {
        // console.log( context.state );
    }, [context.state] );

    return <>
        <ThermalNGroup name="firstGroup" urls={["/sample.lrc"]}/>
        <ThermalNGroup name="fourthGroup" urls={secondGroupUrls}/>
    </>

}