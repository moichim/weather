"use client";

import { createContext, useContext } from "react";
import { UseThermoContextInternalType, useThermoContextInternal, useThermoContextDefaults } from "../hooks/useThermoContextInternal";

export const ThermoContext = createContext<UseThermoContextInternalType>( useThermoContextDefaults );

export const ThermoContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useThermoContextInternal();

    return <ThermoContext.Provider value={value} >
        <style>
            {`.thermal-scale-gradient {background-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(10,12,77,1) 30%, rgba(86,20,101,1) 49%, rgba(255,0,0,1) 64%, rgba(249,255,0,1) 84%, rgba(255,255,255,1) 100%)}`}
        </style>
        {props.children}
    </ThermoContext.Provider>

}

export const useThermoContext = () => {
    return useContext( ThermoContext );
}