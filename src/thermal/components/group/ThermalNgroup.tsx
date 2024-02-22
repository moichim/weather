"use client";

import { useThermoGroupLoader } from "@/thermal/hooks/useThermoGroupLoader";
import { useEffect } from "react";
import { ThermalInstance } from "../instance/ThermalInstance";

type ThermalNGroupProps = {
    name: string,
    urls: string[]
}

export const ThermalNGroup: React.FC<ThermalNGroupProps> = props => {

    const {
        state,
        loadFiles
    } = useThermoGroupLoader( props.name );

    useEffect( () => {
        loadFiles( props.urls );
    }, [ props.urls ] );



    return <div>

        {state && <>
            <h1>{state.groupId}</h1>
            <p>min: {state.min}, max: {state.max}</p>
            <p>cursorX: {state.cursorX}, cursorY: {state.cursorY}</p>
        </>}
        { state && Object.values( state.instancesByPath ).map( instance => <ThermalInstance 
            key={instance.id}
            file={ instance }
            originalSize={false}
            containerStyles={{
                width: "30vw"
            }}
        /> ) }
    </div>
}