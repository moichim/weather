import { ScopeProvider, scopeProvider } from "@/graphql/scope/ScopeProvider";

export class FilesProvider {

    public constructor(
        protected readonly scopeProvider: ScopeProvider
    ){

    }

    public async fetchScopeContent(
        scope: string
    ) {
        const response = await fetch( ScopeProvider.baseUrl + scope + "/content" );

        const json = await response.json();

        return json;
    }

}

export const filesProvider = new FilesProvider( scopeProvider );