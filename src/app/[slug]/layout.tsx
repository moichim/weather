

import { DisplayContextProvider } from "@/state/displayContext";
import { FilterContextProvider } from "@/state/filterContext";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { GraphContextProvider } from "@/state/useGraphStack/graphContext";
import { MeteoContextProvider } from "@/state/useMeteoData/meteoContext";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";
import { GoogleSheetsProvider } from "@/graphql/googleProvider/googleProvider";
import { ScopeHeader } from "@/state/scope/components/scopeHeader";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    const scope = await GoogleSheetsProvider.getScope( props.params.slug )!;

    return <ScopeContextProvider scope={scope!} >
        <MeteoContextProvider>
            <GraphContextProvider>
                <FilterContextProvider>
                    <DisplayContextProvider>

                        <main className="">

                            <header className="fixed w-0 h-0 top-5 left-5 z-[100]">
                                <ScopeHeader />
                            </header>

                            {props.children}
                        </main>

                    </DisplayContextProvider>
                </FilterContextProvider>
            </GraphContextProvider>
        </MeteoContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;