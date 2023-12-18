import { GoogleScope } from "@/graphql/google"

export enum ScopeActions {

    SET_SCOPE = 1,
    REMOVE_SCOPE = 2,
    VALIDATE_SCOPE = 3,
    SET_AVAILABLE_SCOPES = 4

}

type ScopeAllPayloadBase = {
    scopes: GoogleScope[]
}


type ScopeActivePayloadBase = {
    scope: ScopePayloadFormat
}

export type ScopeActionBase = {
    type: ScopeActions,
    payload: ScopeActivePayloadBase|ScopeAllPayloadBase
}

interface ScopeAction<P extends ScopeActivePayloadBase|ScopeAllPayloadBase> extends ScopeActionBase {
    payload: P
}




export type ScopePayloadFormat = string;

export type ScopePayload = ScopeActivePayloadBase;

export type SetScopeAction = ScopeAction<ScopePayload> & {
    type: ScopeActions.SET_SCOPE
}




export type RemoveScopeAction = ScopeAction<ScopePayload> & {
    type: ScopeActions.REMOVE_SCOPE
}




export type SetAvailableScopesAction = ScopeAction<ScopeAllPayloadBase> & {
    type: ScopeActions.SET_AVAILABLE_SCOPES
}



export class ScopeActionsFactory {

    public static setScope(
        scope: ScopePayloadFormat
    ): SetScopeAction {

        return {
            type: ScopeActions.SET_SCOPE,
            payload: {
                scope
            }
        }
    }

    public static removeScope(
        scope: ScopePayloadFormat
    ): RemoveScopeAction {
        return {
            type: ScopeActions.REMOVE_SCOPE,
            payload: {
                scope
            }
        }
    }

    public static setAvailableScopes(
        scopes: GoogleScope[]
    ): SetAvailableScopesAction {
        return {
            type: ScopeActions.SET_AVAILABLE_SCOPES,
            payload: {
                scopes
            }
        }
    }

}