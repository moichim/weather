import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { DisplayContextProvider } from "@/state/graph/useBarInternal";
import { ScopeHeader } from "@/state/scope/components/scopeHeader";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { MeteoContextProvider } from "@/state/meteo/meteoContext";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    return <MeteoContextProvider>
        <GraphContextProvider>
            <DisplayContextProvider>

                <main className="">

                    <header className="fixed w-0 h-0 top-5 left-5 z-[100]">
                        <ScopeHeader />
                    </header>

                    {props.children}
                </main>

            </DisplayContextProvider>
        </GraphContextProvider>
    </MeteoContextProvider>
}

export default ScopeLayout;