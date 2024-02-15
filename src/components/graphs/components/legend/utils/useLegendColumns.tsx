"use client";

import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";

type GraphLegendColumnType = {
    name: React.ReactNode,
    color: string,
    description?: React.ReactNode,
    in: React.ReactNode
}

export const useLegendColumns = () => {

    const { response } = useMeteoContext();

    return useMemo(() => {

        if (response === undefined)
            return {};

        const reduced = response.rangeGoogle.data.reduce((state, current) => {

            const newState = { ...state };

            const currentIn = `${current.in.name ?? current.in.slug} (${current.in.unit}):`;

            const currentRecord = {
                name: current.name,
                color: current.color,
                description: current.description,
                in: currentIn
            }

            if (currentIn in newState) {
                newState[currentIn].push(currentRecord);
            } else {
                newState[currentIn] = [currentRecord];
            }

            return newState;
        }, {} as { [index: string]: GraphLegendColumnType[] });

        return reduced;

    }, [ response ]);
    
}