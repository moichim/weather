import { GoogleScope } from "@/graphql/google"

export type ScopeContextType = {

    storedScope?: string

    activeScope?: GoogleScope,

    availableScopes: GoogleScope[]

}

export const scopeContextDefaults: ScopeContextType = {
    activeScope: undefined,
    availableScopes: [],
    storedScope: undefined
}