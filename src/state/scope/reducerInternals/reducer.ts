import { ScopeActionBase, ScopeActions, ScopePayloadFormat } from "./actions";
import {Reducer} from "react";
import { ScopeContextType } from "./storage";
import { GoogleScope } from "@/graphql/google";
import { NO_SCOPE_STORAGE_VALUE } from "../useScopeInternal";

const fetchScopeFromApi = (
    scope: string
) => {}

export const scopeReducer: Reducer<ScopeContextType, ScopeActionBase> = (
    state,
    action
) => {

    switch ( action.type ) {

        case ScopeActions.SET_SCOPE:

            if (state.availableScopes.length === 0) {
                return state;
            }

            const newActiveScope = "scope" in action.payload
                ? action.payload.scope
                : "_";

            if ( ! state.availableScopes.map(s=>s.slug).includes( newActiveScope ) ) {
                return state;
            }

            const newActiveScopeRecord = state.availableScopes.find( s => s.slug === newActiveScope );

            return {
                ...state,
                activeScope: newActiveScopeRecord,
                storedScope: newActiveScopeRecord?.slug
            }

        case ScopeActions.SET_AVAILABLE_SCOPES:

            const availableScopes = "scopes" in  action.payload
                ? action.payload.scopes
                : [];

            const slugsOfAvailableScopes = availableScopes.map( s=>s.slug );

            let activeScope: GoogleScope|undefined = undefined;

            if ( state.activeScope ) {
                if ( slugsOfAvailableScopes.includes( state.activeScope.slug ) ) {
                    activeScope = availableScopes.find( s => s.slug === state.activeScope?.slug )!
                }
            } else if ( state.storedScope ) {
                if ( slugsOfAvailableScopes.includes( state.storedScope ) ) {
                    activeScope = availableScopes.find( s => s.slug === state.storedScope )
                }
            }

            return {
                ...state,
                availableScopes,
                activeScope,
                storedScope: activeScope ? activeScope.slug : NO_SCOPE_STORAGE_VALUE
            }


    }

    return state;

}