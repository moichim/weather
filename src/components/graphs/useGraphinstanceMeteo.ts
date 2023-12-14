import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties";
import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext";
import { useMemo } from "react";

export const useGraphInstanceMeteo = (
    propertySlug: AvailableWeatherProperties
) => {

    const { data, dispatch, selection, isLoading } = useMeteoContext();

    const graphData = useMemo( () => {

        if ( data ) {

            if ( propertySlug in data )
                return data[propertySlug];

        }

        return undefined;

    }, [propertySlug, data] );

    return {
        data: graphData,
        dispatch,
        selection,
        isLoading
    }


}