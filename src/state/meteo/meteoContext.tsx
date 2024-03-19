"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { useMeteoDataReturnType, useMeteoInternal, useMeteoDataDefaults } from "./useMeteoInternal";
import { GoogleScope } from "@/graphql/google/google";


const MeteoContext = createContext<useMeteoDataReturnType>(useMeteoDataDefaults);

type MeteoContextProps = React.PropsWithChildren & {
    scope: GoogleScope
}

export const MeteoContextProvider: React.FC<MeteoContextProps> = props => {

    const value = useMeteoInternal( props.scope );

    return <MeteoContext.Provider value={value}>
        {props.children}
    </MeteoContext.Provider>

}

export const useMeteoContext = () => {
    return useContext( MeteoContext );
}