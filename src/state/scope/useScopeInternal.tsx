import { useReducer, useState, useEffect } from "react"
import { scopeReducer } from "./reducerInternals/reducer";
import { scopeContextDefaults } from "./reducerInternals/storage";
import { useQuery } from "@apollo/client";
import { GOOGLE_SCOPES_QUERY, GoogleScopeQueryRequest, GoogleScopesQueryResponse } from "./data/query";
import { ScopeActionsFactory } from "./reducerInternals/actions";
import { NotificationFactory, useNotficationsContext } from "../useNotifications/useNotifications";

const STORAGE_SCOPE_KEY = "active_scope";
export const NO_SCOPE_STORAGE_VALUE = "_";

export const useScopeInternal = (
    scope: string
) => {

    const [
        state, 
        dispatch
    ] = useReducer( scopeReducer, {
        ...scopeContextDefaults,
        storedScope: scope
    } );


    const {addNotification} = useNotficationsContext();


    useEffect(() => {
        localStorage.setItem( STORAGE_SCOPE_KEY, state.storedScope ?? NO_SCOPE_STORAGE_VALUE )
    }, [state.storedScope]);

    useEffect( () => {

        if ( state.activeScope ) {

            if ( state.activeScope.slug !== NO_SCOPE_STORAGE_VALUE ) 
                addNotification( NotificationFactory.success( `Načten projekt ${state.activeScope.name}` ) );
        }

    }, [state.activeScope] );

    const query = useQuery<GoogleScopesQueryResponse,GoogleScopeQueryRequest>( GOOGLE_SCOPES_QUERY, {

        onCompleted: data => {

            dispatch( ScopeActionsFactory.setAvailableScopes( data.googleScopes ) );

        }

    } );

    return {
        ...state,
        dispatch,
        isLoading: query.loading
    }

}

export type UseScopeHopokType = ReturnType<typeof useScopeInternal>;

export const useScopeDefaults: UseScopeHopokType = {
    availableScopes: [],
    activeScope: undefined,
    dispatch: () => {},
    isLoading: false
}