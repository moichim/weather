import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";

export const useLegendSources = () => {

    const { response } = useMeteoContext();

    return useMemo(() => {

        if (response === undefined)
            return [];

        return response.weatherRange.data.map(source => ({
            name: source.source.name,
            color: source.source.color,
            description: source.source.description,
            link: source.source.link
        }));
    }, [response]);

}