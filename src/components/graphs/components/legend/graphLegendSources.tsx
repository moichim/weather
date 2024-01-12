"use client"

import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";
import { LegendItem } from "./legendITem";

export const GraphLegendSources: React.FC = () => {

    const { response } = useMeteoContext();

    const queriedProperties: {
        name: string, color: string, in: string
    }[] = useMemo(() => {
        if (response === undefined)
            return [];
        return response.range.data.map(property => ({
            name: property.name,
            color: property.color,
            in: property.in.name ?? property.in.slug
        }));
    }, [response]);

    return <ul className="list-disc ml-5">
        {queriedProperties.map( property => <LegendItem key={property.name} {...property} /> )}
    </ul>
}