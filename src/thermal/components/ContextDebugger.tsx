"use client"

import { useEffect } from "react";
import { useThermalContext } from "../context/thermalContext"
import { useThermalContextNew } from "../context/thermalContextNew";
import { ThermalActionsNewFactory } from "../context/reducerUpdated/actions";
import { ThermalNGroup } from "./ngroup/ThermalNgroup";

export const ContextDebugger: React.FC = () => {

    const context = useThermalContextNew();

    /*
    useEffect( () => {
        context.dispatch( ThermalActionsNewFactory.grouplInit( "firstGroup" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample.lrc" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample2.lrc" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample2.lrc" ) );

        context.dispatch( ThermalActionsNewFactory.grouplInit( "secondGroup" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "secondGroup", "/sample.lrc" ) );
    }, [] );
    */

    useEffect( () => {
        // console.log( context.state );
    }, [context.state] );

    return <>
    <ThermalNGroup name="firstGroup" urls={["/sample.lrc"]}/>
        <ThermalNGroup name="fourthGroup" urls={["/sample2.lrc","/sample2.lrc"]}/>
    </>

}