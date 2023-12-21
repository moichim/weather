"use client";

import { useDisplayContext } from "@/state/graph/useBarInternal";
import { cn } from "@nextui-org/react";
import { PropsWithChildren } from "react";
import { BarPanel } from "./barPanel";
import { BarExpandButton } from "./barExpandButton";

export const Bar: React.FC<PropsWithChildren> = props => {

    const {expanded} = useDisplayContext();

    return <div className="w-full fixed bottom-0 left-0 p-5 z-10">
        <div style={{paddingLeft: "1.25rem", paddingRight:"1.25rem", paddingBottom:"1.25rem"}}>
        <div className="rounded-xl w-full bg-foreground bg-opacity-50 text-background flex items-center p-3">
            <BarPanel />
        </div>
        </div>
    </div>

}