import { ScopeHeading } from "@/components/scope/scopeHeading";
import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { DisplayContextProvider } from "@/state/graph/useBarInternal";
import { MeteoContextProvider } from "@/state/meteo/meteoContext";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";
import { Navbar } from "@/components/navigation/utils/Navbar";
import { Link } from "@nextui-org/react";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;


/** @todo Should not use the meteo context at all! */
const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    const allScopes = await googleSheetsProvider.fetchAllScopesDefinitions();
    const scope = allScopes.find(s => s.slug === props.params.slug)!;

    if (scope === undefined)
        notFound();

    return <ScopeContextProvider activeScope={scope} allScopes={allScopes}>
        <MeteoContextProvider>
            <GraphContextProvider>
                <DisplayContextProvider>

                    <Navbar
                        brandContent={<strong>{scope.name}</strong>}
                        links={[
                            {
                                text: "Naměřená data",
                                href:  `/${scope.slug}`,
                            },
                            {
                                text: "Informace o týmu",
                                href: `/${scope.slug}/info`
                            },
                            {
                                text: "Termogramy",
                                href: `/${scope.slug}/thermo`
                            },
                        ]}
                        closeLink="/"
                        closeLinkHint={`Zavřít projekt ${scope.name}`}
                        className="bg-slate-100"
                    />

                    <main className="w-full h-full min-h-screen bg-gray-200 pb-[10rem]">
                        {props.children}
                    </main>
                </DisplayContextProvider>
            </GraphContextProvider>
        </MeteoContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;