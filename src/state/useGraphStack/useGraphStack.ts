import { useReducer } from "react";
import { StackActions } from "./actions";
import { useGraphStackReducer } from "./reducer";
import { GraphStateFactory } from "./storage";

export const useGraphStack = () => {

    const [state, dispatch] = useReducer( useGraphStackReducer, GraphStateFactory.defaultState() );

    // dispatch( StackActions.resetAll() );

    return {
        state,
        dispatch
    }
}

export type UseGraphStackValues = ReturnType< typeof useGraphStack >;