"use client";

import { createContext, useContext } from "react";
import { useRegistryContextInternal, useRegistryContextInternalDefaults } from "./useRegistryContextInternal";

export const RegistryContext = createContext( useRegistryContextInternalDefaults );

export const RegistryContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useRegistryContextInternal();

    return <RegistryContext.Provider value={value}>
        <style>
            {`.thermal-scale-gradient {background-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(10,12,77,1) 30%, rgba(86,20,101,1) 49%, rgba(255,0,0,1) 64%, rgba(249,255,0,1) 84%, rgba(255,255,255,1) 100%)}`}
        </style>
        {props.children}
    </RegistryContext.Provider>

}

export const useRegistryContext = () => {
    return useContext( RegistryContext );
}