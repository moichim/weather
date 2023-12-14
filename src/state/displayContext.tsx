"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";


type DisplayContextType = {
    expanded: boolean,
    setExpanded: Dispatch<SetStateAction<boolean>>
}

const initialData: DisplayContextType = {
    expanded: false,
    setExpanded: () => {}
}

const DisplayContext = createContext( initialData );

export const DisplayContextProvider: React.FC<React.PropsWithChildren> = props => {

    const [expanded, setExpanded] = useState<boolean>(false);

    const value: DisplayContextType = {
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