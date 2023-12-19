import { GoogleScope } from "@/graphql/google"

export type ScopeContextType = {

    activeScope?: GoogleScope,

    availableScopes: GoogleScope[]

}