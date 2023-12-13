"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { useMeteoDataReturnType, useMeteoData, useMeteoDataDefaults } from "./useMeteoData";


const MeteoContext = createContext<useMeteoDataReturnType>(useMeteoDataDefaults);

export const MeteoContextProvider: React.FC<PropsWithChildren> = props => {

    const value = useMeteoData();

    return <MeteoContext.Provider value={value}>
        {props.children}
    </MeteoContext.Provider>

}

export const useMeteoContext = () => {
    return useContext( MeteoContext );
}