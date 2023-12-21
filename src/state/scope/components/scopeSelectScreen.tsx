import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopeCard } from "./scopeCard";

export const ScopeSelectScreen = async () => {

    const data = await GoogleSheetsProvider.getAllScopes();

    return <div className="flex wrap w-full gap-4">
        {data.map(scope => <ScopeCard {...scope} key={scope.slug} />)}
    </div>

}