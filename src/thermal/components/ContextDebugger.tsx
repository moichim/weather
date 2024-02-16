"use client"

import { useEffect } from "react";
import { useThermalContext } from "../context/thermalContext"
import { useThermalContextNew } from "../context/thermalContextNew";
import { ThermalActionsNewFactory } from "../context/reducerUpdated/actions";

export const ContextDebugger: React.FC = () => {

    const context = useThermalContextNew();

    useEffect( () => {
        context.dispatch( ThermalActionsNewFactory.grouplInit( "firstGroup" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample.lrc" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample2.lrc" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "firstGroup", "/sample2.lrc" ) );

        context.dispatch( ThermalActionsNewFactory.grouplInit( "secondGroup" ) );
        context.dispatch( ThermalActionsNewFactory.groupLoadFile( "secondGroup", "/sample2.lrc" ) );
    }, [] );

    useEffect( () => {}, [context.state.requestsFiredByUrl] );

    useEffect( () => {
        console.log( context );
    }, [context] );

    return <></>

}