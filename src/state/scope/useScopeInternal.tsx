import { GoogleScope } from "@/graphql/google/google";
import { useQuery } from "@apollo/client";
import { useReducer } from "react";
import { GOOGLE_SCOPES_QUERY, GoogleScopeQueryRequest, GoogleScopesQueryResponse } from "./data/query";
import { ScopeActionBase, ScopeActionsFactory } from "./reducerInternals/actions";
import { scopeReducer } from "./reducerInternals/reducer";
import { ScopeContextType } from "./reducerInternals/storage";


export const useScopeInternal = (
    activeScope: GoogleScope,
    allScopes: GoogleScope[]
) => {

    const [
        state,
        dispatch
    ] = useReducer<React.Reducer<ScopeContextType, ScopeActionBase>>(scopeReducer, {
        activeScope: activeScope,
        availableScopes: allScopes.filter( s => s.slug !== activeScope.slug ),
        allScopes: allScopes
    });

    const query = useQuery<GoogleScopesQueryResponse, GoogleScopeQueryRequest>(GOOGLE_SCOPES_QUERY, {

        onCompleted: data => {

            dispatch(ScopeActionsFactory.setAllScopes(data.googleScopes));

        },

        ssr: false

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
        allScopes: [],
        isLoading: false,
        dispatch: () => { }
    }
}