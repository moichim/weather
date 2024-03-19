"use client";

import { WeatherStatistic } from "@/graphql/weather/weather";
import { AvailableWeatherProperties, Properties } from "@/graphql/weather/definitions/properties";
import { StatisticsProcessing } from "@/state/meteo/data/statisticsProcessing";
import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useMemo } from "react";
import { useTimeContext } from "@/state/time/timeContext";

export type ViewInstanceStatisticsType = {
    [index: string]: WeatherStatistic
}

/** Extracts one property data for the purpose of one instnace */
export const useGraphInstanceMeteo = (
    propertySlug: AvailableWeatherProperties
) => {

    const { data, isLoadingData, isLoadingRange, viewStatistics, rangeStatistics } = useMeteoContext();

    const property = useMemo(() => {
        return Properties.one(propertySlug);
    }, [propertySlug]);

    const graphData = useMemo(() => {

        if (data) {

            if (propertySlug in data)
                return data[propertySlug];

        }

        return undefined;

    }, [propertySlug, data]);

    const viewInstanceStatistics = StatisticsProcessing.extractForOneProperty(viewStatistics, property);

    const rangeInstanceStatistics = rangeStatistics ? StatisticsProcessing.extractForOneProperty(rangeStatistics, property) : undefined;

    return {
        data: graphData,
        isLoadingData,
        isLoadingRange,
        viewStatistics: viewInstanceStatistics,
        property,
        rangeStatistics: rangeInstanceStatistics
    }


}