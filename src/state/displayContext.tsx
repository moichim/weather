"use client";

import { WeatherEntryDataType } from "@/graphql/weather";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { MultipleGraphsHookType, useMultipleGraphs, useMultipleGraphsDefaults } from "./useMultipleGraphs";

enum GraphMode {
    MULTIPLE = 1,
    SINGLE = 1
}

type DisplayContextType = {

    mode: GraphMode,
    setMode: ( mode: GraphMode ) => void,
    single: {
        properties: {
            [T in keyof WeatherEntryDataType]: boolean
        },
        setProperty: ( property: keyof WeatherEntryDataType, state: boolean ) => void
    },
    multiple: MultipleGraphsHookType,

    expanded: boolean,
    setExpanded: Dispatch<SetStateAction<boolean>>

}

const initialData: DisplayContextType = {
    mode: GraphMode.SINGLE,
    setMode: () => {},
    single: {
        properties: {
            temperature: true,
            wind_dir: false,
            wind_speed: true,
            bar: true,
            rain: true,
            clouds: true,
            humidity: true,
            uv: true
        },
        setProperty: ( property, state ) => {},
    },
    multiple: useMultipleGraphsDefaults(),
    expanded: false,
    setExpanded: () => {}
}

type PropertiesSettingsType = typeof initialData["single"]["properties"];

const DisplayContext = createContext( initialData );

export const DisplayContextProvider: React.FC<React.PropsWithChildren> = props => {

    const [ mode, setMode ] = useState<GraphMode>( GraphMode.SINGLE );

    const [ properties, setProperties ] = useState< {
        [T in keyof PropertiesSettingsType]: boolean
    } >( initialData.single.properties );

    const multiple = useMultipleGraphs();

    const [expanded, setExpanded] = useState<boolean>(false);

    const setProperty = ( property: keyof PropertiesSettingsType, state: boolean ) => {
        setProperties( propers => {
            return { 
                ...propers,
                [property]: state
            }
        } );
    };

    const value: DisplayContextType = {
        mode: mode,
        setMode,
        single: {
            properties,
            setProperty
        },
        multiple,
        expanded,
        setExpanded
    };

    return <DisplayContext.Provider value={value}>
        {props.children}
    </DisplayContext.Provider>
}

export const useDisplayContext = () => {
    return useContext( DisplayContext );
}