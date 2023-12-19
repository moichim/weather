import { GoogleScope } from "@/graphql/google";
import { useQuery } from "@apollo/client";
import { useReducer } from "react";
import { GOOGLE_SCOPES_QUERY, GoogleScopeQueryRequest, GoogleScopesQueryResponse } from "./data/query";
import { ScopeActionBase, ScopeActionsFactory } from "./reducerInternals/actions";
import { scopeReducer } from "./reducerInternals/reducer";
import { ScopeContextType } from "./reducerInternals/storage";


export const useScopeInternal = (
    scope: GoogleScope
) => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ScopeContextType, ScopeActionBase>>(scopeReducer, {
        activeScope: scope,
        availableScopes: []
    });

    const query = useQuery<GoogleScopesQueryResponse, GoogleScopeQueryRequest>(GOOGLE_SCOPES_QUERY, {

        onCompleted: data => {

            dispatch(ScopeActionsFactory.setAvailableScopes(data.googleScopes));

        }

    });

    return {
        ...state,
        dispatch,
        isLoading: query.loading
    }

}

export type UseScopeHookType = ReturnType<typeof useScopeInternal>;

export const getContextDefaults = (): UseScopeHookType => {
    return {
        activeScope: undefined,
        availableScopes: [],
        isLoading: false,
        dispatch: () => { }
    }
}