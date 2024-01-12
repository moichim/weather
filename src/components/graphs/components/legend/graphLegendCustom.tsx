"use client"

import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";
import { LegendItem } from "./legendITem";

export const GraphLegendCustom: React.FC = () => {

    const { response } = useMeteoContext();

    const queriedSources: {
        name: string, color: string, description: string, link?: string
    }[] = useMemo(() => {
        if (response === undefined)
            return [];
        return response.weatherRange.map(source => ({
            name: source.source.name,
            color: source.source.color,
            description: source.source.description,
            link: source.source.link
        }));
    }, [response]);

    return <ul className="list-disc ml-5">
        {queriedSources.map( property => <LegendItem key={property.name} {...property} /> )}
    </ul>
}