import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { DisplayContextProvider } from "@/state/graph/useBarInternal";
import { MeteoContextProvider } from "@/state/meteo/meteoContext";
import { ScopeHeading } from "@/state/scope/components/scopeHeading";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    const allScopes = await GoogleSheetsProvider.getAllScopes();
    const scope = allScopes.find( s => s.slug === props.params.slug );

    if ( scope === undefined )
        notFound();

    return <ScopeContextProvider activeScope={scope} allScopes={allScopes}>
        <MeteoContextProvider>
            <GraphContextProvider>
                <DisplayContextProvider>

                        <header className="fixed w-0 h-0 top-5 left-5 z-[20]">
                            <ScopeHeading {...scope} />
                        </header>

                        <main className="w-full h-full min-h-screen bg-gray-200 pb-[10rem] pt-20">
                            {props.children}
                        </main>

                </DisplayContextProvider>
            </GraphContextProvider>
        </MeteoContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;