"use client";

import { useDisplayContext } from "@/state/graph/useBarInternal";
import { cn } from "@nextui-org/react";
import { PropsWithChildren } from "react";
import { BarPanel } from "./barPanel";
import { BarExpandButton } from "./barExpandButton";

export const Bar: React.FC<PropsWithChildren> = props => {

    const {expanded} = useDisplayContext();

    return <div className="w-full fixed bottom-0 left-0 lg:p-5 z-10">
        <div className="lg:rounded-xl shadow-2xl shadow-primary-900 bg-gradient-to-r from-primary-800 to-black text-background p-3 bg-opacity-50">
            <BarPanel />
        </div>
    </div>

}