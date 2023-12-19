"use client";

import {createContext, useContext} from "react";
import { UseScopeHookType, getContextDefaults, useScopeInternal } from "./useScopeInternal";
import { GoogleScope } from "@/graphql/google/google";

const def = getContextDefaults();

const ScopeContext = createContext(def);

type ScopeContextProviderProps = React.PropsWithChildren & {
    scope: GoogleScope
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