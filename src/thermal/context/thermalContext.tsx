"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { UseThermalInternalReturnValue, useThermalInternal, useThermalInternalDefault } from "./useThermalInternal";

const ThermalContext = createContext<UseThermalInternalReturnValue>(useThermalInternalDefault);

export const ThermalContextProvider: React.FC<PropsWithChildren> = props => {

    const value = useThermalInternal();

    return <ThermalContext.Provider value={value}>
        {props.children}
    </ThermalContext.Provider>

}

export const useThermalContext = () => {
    return useContext( ThermalContext );
}