import { WeatherStatistic } from "@/graphql/weather";
import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties";
import { StatisticsProcessing } from "@/state/useMeteoData/data/statisticsProcessing";
import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext";
import { useMemo } from "react";

export type ViewInstanceStatisticsType = {
    [index: string]: WeatherStatistic
}

/** Extracts one property data for the purpose of one instnace */
export const useGraphInstanceMeteo = (
    propertySlug: AvailableWeatherProperties
) => {

    const { data, dispatch, selection, isLoading, viewStatistics } = useMeteoContext();

    const property = useMemo( () => {
        return Properties.one( propertySlug );
    }, [propertySlug] );

    const graphData = useMemo( () => {

        if ( data ) {

            if ( propertySlug in data )
                return data[propertySlug];

        }

        return undefined;

    }, [propertySlug, data] );

    const viewInstanceStatistics = StatisticsProcessing.extractForOneProperty( viewStatistics, property );

    return {
        data: graphData,
        dispatch,
        selection,
        isLoading,
        viewStatistics: viewInstanceStatistics,
        property
    }


}