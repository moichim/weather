"use client";

import {createContext, useContext} from "react";
import { useScopeInternal, useScopeDefaults } from "./useScopeInternal";

const ScopeContext = createContext( useScopeDefaults );

type ScopeContextProviderProps = React.PropsWithChildren & {
    scope: string
}

export const ScopeContextProvider: React.FC<ScopeContextProviderProps> = props => {

    const value = useScopeInternal( props.scope );

    return <ScopeContext.Provider value={value}>
        {props.children}
    </ScopeContext.Provider>

}

export const useScopeContext = () => {

    return useContext( ScopeContext );

}