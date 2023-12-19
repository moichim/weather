import { Reducer } from "react";
import { ScopeActionBase, ScopeActions } from "./actions";
import { ScopeContextType } from "./storage";

export const scopeReducer: Reducer<ScopeContextType, ScopeActionBase> = (
    state,
    action
) => {

    switch (action.type) {

        case ScopeActions.SET_AVAILABLE_SCOPES:

            const availableScopes = "scopes" in action.payload
                ? action.payload.scopes.filter(s => s.slug !== state.activeScope?.slug)
                : [];


            return {
                ...state,
                availableScopes
            }


    }

    return state;

}