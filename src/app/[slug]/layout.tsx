import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { DisplayContextProvider } from "@/state/graph/useBarInternal";
import { MeteoContextProvider } from "@/state/meteo/meteoContext";
import { ScopePageWrapper } from "@/state/scope/components/ScopePageWrapper";
import { ScopeHeader } from "@/state/scope/components/scopeHeader";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    const scope = await GoogleSheetsProvider.getScope(props.params.slug);


    return <MeteoContextProvider>
        <GraphContextProvider>
            <DisplayContextProvider>

                <ScopePageWrapper scope={scope}>

                    <header className="fixed w-0 h-0 top-5 left-5 z-[100]">
                        <ScopeHeader />
                    </header>

                    <main className="w-full h-full min-h-screen bg-gray-200 pb-[10rem] pt-20">
                        {props.children}
                    </main>

                </ScopePageWrapper>

            </DisplayContextProvider>
        </GraphContextProvider>
    </MeteoContextProvider>
}

export default ScopeLayout;