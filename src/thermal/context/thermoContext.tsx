"use client";

import { createContext, useContext } from "react";
import { UseThermoContextInternalType, useThermoContextInternal, useThermoContextDefaults } from "../hooks/useThermoContextInternal";

export const ThermoContext = createContext<UseThermoContextInternalType>( useThermoContextDefaults );

export const ThermoContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useThermoContextInternal();

    return <ThermoContext.Provider value={value} >
        {props.children}
    </ThermoContext.Provider>

}

export const useThermoContext = () => {
    return useContext( ThermoContext );
}