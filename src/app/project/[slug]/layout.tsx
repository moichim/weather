import { Navbar } from "@/components/navigation/utils/Navbar";
import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { FromControl } from "@/state/time/components/controls/fromControl";
import { ToControl } from "@/state/time/components/controls/toControl";
import { PresetDropdown } from "@/state/time/components/presetDropdown";
import { TimeContextProvider } from "@/state/time/timeContext";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

export type ScopePageProps = {
    params: {
        slug: string
    }
};

/** @todo Should not use the meteo context at all! */
const ScopeLayout = async ({ ...props }) => {

    const allScopes = await googleSheetsProvider.fetchAllScopesDefinitions();
    const scope = allScopes.find(s => s.slug === props.params.slug)!;

    if (scope === undefined)
        notFound();

    return <ScopeContextProvider activeScope={scope} allScopes={allScopes}>

        <TimeContextProvider scope={scope}>

            <Navbar
                brandContent={<strong>{scope.name}</strong>}
                links={[
                    {
                        text: "Naměřená data",
                        href: `/project/${scope.slug}/data`,
                    },
                    {
                        text: "Informace o týmu",
                        href: `/project/${scope.slug}/info`
                    },
                    {
                        text: "Termogramy",
                        href: `/project/${scope.slug}/thermo`
                    },
                ]}

                closeLink="/"
                closeLinkHint={`Zavřít projekt ${scope.name}`}
                className="bg-slate-100"
                classNames={{
                    // menu: "top-32 bg-red-300"
                }}
            >
                <div className="flex gap-0 items-center group">
                    <FromControl />
                    <div className="h-[2px] bg-gray-300 w-3 group-hover:bg-primary-300"></div>
                    <ToControl />
                </div>
                <PresetDropdown />
            </Navbar>

            <main className="w-full min-h-screen bg-gray-200 pb-[10rem]">
                {props.children}
            </main>

        </TimeContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;