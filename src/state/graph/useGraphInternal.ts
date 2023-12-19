import { useReducer } from "react";
import { StackActions } from "./reducerInternals/actions";
import { useGraphStackReducer } from "./reducerInternals/reducer";
import { GraphStateFactory } from "./reducerInternals/storage";

export const useGraphInternal = () => {

    const [state, dispatch] = useReducer( useGraphStackReducer, GraphStateFactory.defaultState() );

    return {
        graphState: state,
        graphDispatch: dispatch
    }
}

export type UseGraphStackValues = ReturnType< typeof useGraphInternal >;