"use client";

import { createContext, useContext } from "react";
import { useRegistryContextInternal, useRegistryContextInternalDefaults } from "./useRegistryContextInternal";

export const RegistryContext = createContext( useRegistryContextInternalDefaults );

export const RegistryContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useRegistryContextInternal();

    return <RegistryContext.Provider value={value}>
        {props.children}
    </RegistryContext.Provider>

}

export const useRegistryContext = () => {
    return useContext( RegistryContext );
}