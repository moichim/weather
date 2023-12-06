"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { MultipleGraphsHookType, getMultipleGraphsDefaults, useMultipleGraphs } from "./useMultipleGraphs";


type DisplayContextType = {
    set: MultipleGraphsHookType,
    expanded: boolean,
    setExpanded: Dispatch<SetStateAction<boolean>>
}

const initialData: DisplayContextType = {
    set: getMultipleGraphsDefaults(),
    expanded: false,
    setExpanded: () => {}
}

const DisplayContext = createContext( initialData );

export const DisplayContextProvider: React.FC<React.PropsWithChildren> = props => {

    const multiple = useMultipleGraphs();

    const [expanded, setExpanded] = useState<boolean>(false);

    const value: DisplayContextType = {
        set: multiple,
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