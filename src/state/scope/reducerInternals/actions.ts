import { GoogleScope } from "@/graphql/google"

export enum ScopeActions {

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




export type SetAvailableScopesAction = ScopeAction<ScopeAllPayloadBase> & {
    type: ScopeActions.SET_AVAILABLE_SCOPES
}



export class ScopeActionsFactory {

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