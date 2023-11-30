"use client"

import { useDisplayContext } from "@/state/displayContext";
import { Button } from "@nextui-org/react";

export const SettingsExpander: React.FC = () => {

    const { expanded, setExpanded } = useDisplayContext();


    return <Button
        onClick={() => setExpanded(!expanded)}
        isIconOnly
        aria-label={expanded ? "Sbalit" : "Rozbalit"}
        aria-expanded={expanded}
    >

        {!expanded
            ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        }

    </Button>
}