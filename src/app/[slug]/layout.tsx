"use client";

import { Graphs } from "@/components/graphs/graphs";
import { SettingsContainer } from "@/components/settings/settingsContainer";
import { DisplayContextProvider } from "@/state/displayContext";
import { FilterContextProvider } from "@/state/filterContext";
import { ScopeHeader } from "@/state/scope/components/scopeHeader";
import { ScopeContextProvider } from "@/state/scope/scopeContext";
import { GraphContextProvider } from "@/state/useGraphStack/graphContext";
import { MeteoContextProvider } from "@/state/useMeteoData/meteoContext";
import { usePathname, useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import { PropsWithChildren } from "react";
import { ScopePageProps } from "./page";

type ScopeLayoutProps = PropsWithChildren & {
    pageMeta: ScopePageProps
}

const ScopeLayout: React.FC<ScopeLayoutProps> = ({ pageMeta, ...props }) => {

    console.log( "pm", pageMeta );

    console.log( "segment", useSelectedLayoutSegment() );

    const path = usePathname().replace( "/", "" );

    return <ScopeContextProvider scope={path} >
        <MeteoContextProvider>
            <GraphContextProvider>
                <FilterContextProvider>
                    <DisplayContextProvider>
                        {props.children}
                    </DisplayContextProvider>
                </FilterContextProvider>
            </GraphContextProvider>
        </MeteoContextProvider>
    </ScopeContextProvider>
}

export default ScopeLayout;