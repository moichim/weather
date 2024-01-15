import { ScopeHeading } from "@/components/scope/scopeHeading";
import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";

type ScopeLayoutProps = PropsWithChildren & ScopePageProps;

const ScopeLayout: React.FC<ScopeLayoutProps> = async ({ ...props }) => {

    const allScopes = await googleSheetsProvider.getAllScopes();
    const scope = allScopes.find(s => s.slug === props.params.slug);

    if (scope === undefined)
        notFound();

    return <ScopeContextProvider activeScope={scope} allScopes={allScopes}>

        <header className="fixed w-0 h-0 top-5 left-5 z-[20]">
            <ScopeHeading {...scope} />
        </header>

        <main className="w-full h-full min-h-screen bg-gray-200 pb-[10rem] pt-20">
            {props.children}
        </main>

    </ScopeContextProvider>
}

export default ScopeLayout;