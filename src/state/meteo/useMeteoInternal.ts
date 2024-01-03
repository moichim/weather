"use client"

import { useApolloClient, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useMemo, useReducer, useState } from "react";
import { MeteoStateFactory } from "./data/meteoStateFactory";
import { METEO_DATA_QUERY, METEO_RANGE_QUERY, MeteoQueryResponseType, MeteoRequestType } from "./data/query";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";
import { GraphStatisticsDataType, StatisticsProcessing } from "./data/statisticsProcessing";
import { meteoReducer } from "./reducerInternals/reducer";
import { useScopeContext } from "../scope/scopeContext";

/** Hook used by reducer. DO NOT USE IN COMPONENTS! */
export const useMeteoInternal = () => {

    const { activeScope } = useScopeContext();

    const [selection, dispatch] = useReducer(meteoReducer, MeteoStateFactory.defaultState());

    const [processedData, setProcessedData] = useState<MeteoDataProcessed>();

    const [viewStatistics, setViewStatistics] = useState<GraphStatisticsDataType>({
        lines: {},
        dots: {}
    });

    const [rangeStatistics, setRangeStatistics] = useState<GraphStatisticsDataType>();

    const [fetchQuery, query] = useLazyQuery<MeteoQueryResponseType, MeteoRequestType>(METEO_DATA_QUERY, {

        variables: {
            scope: selection.scope,
            from: selection.fromTimestamp,
            to: selection.toTimestamp,
            lat: 0,//activeScope.lat,
            lon: 0,//activeScope.lon,
            hasNtc: false
        },

        onCompleted: data => {

            // Process the graph data
            const processedResponse = MeteoResponseProcessor.process(data);
            setProcessedData(processedResponse);

            // Process the view statistics
            const statistics = StatisticsProcessing.extractAllFromQuery(data);
            setViewStatistics(statistics);
        },

        ssr: false,

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
        if (activeScope !== undefined)
            fetchQuery({
                variables: {
                    lat: activeScope.lat ?? 0,
                    lon: activeScope.lon ?? 0,
                    scope: activeScope.slug,
                    from: selection.fromTimestamp,
                    to: selection.toTimestamp,
                    hasNtc: activeScope.hasNtc
                },
                ssr: false
            })
    }, [activeScope, activeScope?.lat, activeScope?.lon, selection.fromTimestamp, selection.toTimestamp]);


    const [fetchRange, rangeQuery] = useLazyQuery<MeteoQueryResponseType>(METEO_RANGE_QUERY, {
        variables: {
            scope: selection.scope,
            from: selection.rangeMinTimestamp,
            to: selection.rangeMaxTimestamp,
            lat: activeScope?.lat,
            lon: activeScope?.lon,
            hasNtc: activeScope?.hasNtc
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
        if (selection.hasRange === false && rangeStatistics) {
            setRangeStatistics(undefined);
        }
    }, [selection.hasRange, rangeStatistics]);


    useEffect( () => {

        if ( selection.hasRange === true ) {
            if ( activeScope !== undefined ) {
                fetchRange({
                    variables: {
                        scope: activeScope.slug,
                        from: selection.rangeMinTimestamp,
                        to: selection.rangeMaxTimestamp,
                        lat: activeScope.lat,
                        lon: activeScope.lon,
                        hasNtc: activeScope?.hasNtc
                    }
                });
            }
        } else {
            setRangeStatistics( undefined );
        }

    }, [selection.hasRange, activeScope?.lat, activeScope?.lon, selection.rangeMinTimestamp, selection.rangeMaxTimestamp] );


    return {
        selection,
        dispatch,
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
    selection: MeteoStateFactory.defaultState(),
    dispatch: () => { },
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