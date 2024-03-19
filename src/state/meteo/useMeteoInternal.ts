"use client"

import { GoogleScope } from "@/graphql/google/google";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useTimeContext } from "../time/timeContext";
import { METEO_DATA_QUERY, METEO_RANGE_QUERY, MeteoQueryResponseType, MeteoRequestType } from "./data/query";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";
import { GraphStatisticsDataType, StatisticsProcessing } from "./data/statisticsProcessing";

/** Hook used by reducer. DO NOT USE IN COMPONENTS! */
export const useMeteoInternal = (
    scope: GoogleScope
) => {

    const time = useTimeContext();

    const [processedData, setProcessedData] = useState<MeteoDataProcessed>();

    const [viewStatistics, setViewStatistics] = useState<GraphStatisticsDataType>({
        lines: {},
        dots: {}
    });

    const [rangeStatistics, setRangeStatistics] = useState<GraphStatisticsDataType>();

    const [fetchQuery, query] = useLazyQuery<MeteoQueryResponseType, MeteoRequestType>(METEO_DATA_QUERY, {

        variables: {
            scope: scope.slug,
            sheetId: scope.sheetId,
            sheetTab: scope.sheetTab,
            from: time.timeState.from,
            to: time.timeState.to,
            lat: scope.lat,
            lon: scope.lon,
            hasNtc: scope.hasNtc
        },

        onCompleted: data => {

            console.log("přišla odpověď", data);

            // Process the graph data
            const processedResponse = MeteoResponseProcessor.process(data);
            setProcessedData(processedResponse);

            // Process the view statistics
            const statistics = StatisticsProcessing.extractAllFromQuery(data);
            setViewStatistics(statistics);
        },

        ssr: false,
        // nextFetchPolicy: "no-cache",

        onError: (e) => {
            console.error("error loading weather data", e, e.graphQLErrors, e.message);
        },

    });

    const client = useApolloClient();

    const refetchView = () => {
        client.resetStore();
        query.refetch();
    }

    useEffect(() => {

        const action = () => fetchQuery({
            variables: {
                lat: scope.lat,
                lon: scope.lon,
                scope: scope.slug,
                sheetId: scope.sheetId,
                sheetTab: scope.sheetTab,
                from: time.timeState.from,
                to: time.timeState.to,
                hasNtc: scope.hasNtc
            },
            ssr: false
        });

        let timeout: NodeJS.Timeout | undefined;

        if ( processedData === undefined && query.loading === false ) {
            action();
        } else {
            timeout = setTimeout( action, 300 );
        }



        return () =>  clearTimeout( timeout );

    }, [time.timeState.from, time.timeState.to, fetchQuery]);


    const [fetchRange, rangeQuery] = useLazyQuery<MeteoQueryResponseType>(METEO_RANGE_QUERY, {
        variables: {
            scope: scope,
            sheetId: scope.sheetId,
            sheetTab: scope.sheetTab,
            from: time.timeState.from,
            to: time.timeState.to,
            lat: scope.lat,
            lon: scope.lon,
            hasNtc: scope?.hasNtc
        },

        onCompleted: (data) => {
            const statistics = StatisticsProcessing.extractAllFromQuery(data);
            setRangeStatistics(statistics);
        },

        onError: (e) => {
            console.error("error loading weather statistics", e, e.graphQLErrors, e.message);
        },

        ssr: false,

        fetchPolicy: "network-only"


    });

    useEffect(() => {
        if (time.timeState.hasSelection === false && rangeStatistics) {
            setRangeStatistics(undefined);
        }
    }, [time.timeState.hasSelection, rangeStatistics]);


    useEffect(() => {

        if (
            time.timeState.hasSelection === true
            && time.timeState.selectionFrom !== undefined
            && time.timeState.selectionTo !== undefined
        ) {
            if (scope !== undefined) {
                fetchRange({
                    variables: {
                        scope: scope.slug,
                        sheetId: scope.sheetId,
                        sheetTab: scope.sheetTab,
                        from: time.timeState.selectionFrom,
                        to: time.timeState.selectionTo,
                        lat: scope.lat,
                        lon: scope.lon,
                        hasNtc: scope.hasNtc
                    }
                });
            }
        } else {
            setRangeStatistics(undefined);
        }

    }, [time.timeState.hasSelection, scope?.lat, scope?.lon, time.timeState.selectionFrom, time.timeState.selectionTo, scope, fetchRange]);


    return {
        refetch: refetchView,
        response: query.data,
        data: processedData,
        isLoadingData: query.loading,
        isLoadingRange: rangeQuery.loading,
        viewStatistics,
        rangeStatistics
    }

}

export type useMeteoDataReturnType = ReturnType<typeof useMeteoInternal>

export const useMeteoDataDefaults: useMeteoDataReturnType = {
    refetch: () => { },
    data: {},
    response: undefined,
    isLoadingData: false,
    isLoadingRange: false,
    viewStatistics: {
        lines: {},
        dots: {}
    },
    rangeStatistics: undefined
}