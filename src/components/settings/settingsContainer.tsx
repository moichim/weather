"use client";

import { useDisplayContext } from "@/state/displayContext";
import { cn } from "@nextui-org/react";
import { PropsWithChildren } from "react";
import { SettingsBar } from "./settingsBar";
import { SettingsExpander } from "./settingsExpander";

export const SettingsContainer: React.FC<PropsWithChildren> = props => {

    const {expanded} = useDisplayContext();

    return <div className="w-full fixed bottom-0 left-0 shadow-2xl z-10">
        <div className="w-full border bg-white flex items-center p-3">
            <SettingsBar />
            <SettingsExpander />
        </div>
        <div 
            className={cn([
                "ease-in-out duration-400 transition-all",
                !expanded ? "max-h-0 h-0" : "max-h-40 h-[400px]"
            ])}
        >
            <div className="p-3 bg-gray-100 w-full h-full">
                {props.children}
            </div>
        </div>
    </div>

}