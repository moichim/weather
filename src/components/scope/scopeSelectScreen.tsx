import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopeCard } from "./scopeCard";
import dynamic from "next/dynamic";

const Map = dynamic( () => import("../ui/map"), {ssr: false} );

export const ScopeSelectScreen = async () => {

    const data = await GoogleSheetsProvider.getAllScopes();

    return <>

        <div className="py-4 text-xl flex gap-4">
            <div>Zapojené školy
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
        </div>



        <div className="flex wrap w-full gap-10 pb-16">
            {data.map(scope => <ScopeCard {...scope} key={scope.slug} />)}
        </div>

        <div className="pb-10">
            <Map scopes={data} height="500px" />
        </div>
    </>

}