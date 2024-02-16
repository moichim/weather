"use client"

import { createContext, useContext } from "react";
import { UseThermalContextNewType, useThermalContextDefaults, useThermalContextNewInternal } from "./useThermalContextNewinternal";

const ThermalContextNew = createContext<UseThermalContextNewType>( useThermalContextDefaults );

export const ThermalContextNewProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useThermalContextNewInternal();

    return <ThermalContextNew.Provider value={value}>
        {props.children}
    </ThermalContextNew.Provider>

}

export const useThermalContextNew = () => {
    return useContext( ThermalContextNew );
}