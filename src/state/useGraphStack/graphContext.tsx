"use client"

import { createContext, useContext } from "react";
import { GraphStateFactory } from "./storage"
import { UseGraphStackValues, useGraphStack } from "./useGraphInternal"

type GraphContextType = {
    stack: UseGraphStackValues
}

const initialData: GraphContextType = {
    stack: {
        state: GraphStateFactory.defaultState(),
        dispatch: () => {}
    }
};

const GraphContext = createContext( initialData );

export const GraphContextProvider: React.FC<React.PropsWithChildren> = props => {

    const stack = useGraphStack();

    const value = {
        stack: stack
    }

    return <GraphContext.Provider value={value}>
        {props.children}
    </GraphContext.Provider>

}

/** Use graph display settings stored  in global context. */
export const useGraphContext = () => {
    return useContext( GraphContext );
}