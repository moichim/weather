import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect, useReducer, useState } from "react";
import { MeteoStateFactory } from "./data/meteoStateFactory";
import { METEO_DATA_QUERY, METEO_RANGE_QUERY, MeteoQueryResponseType, MeteoRequestType } from "./data/query";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";
import { GraphStatisticsDataType, StatisticsProcessing } from "./data/statisticsProcessing";
import { meteoReducer } from "./reducerInternals/reducer";

/** Hook used by reducer. DO NOT USE IN COMPONENTS! */
export const useMeteoData = () => {

    const [selection, dispatch] = useReducer(meteoReducer, MeteoStateFactory.defaultState());

    const [processedData, setProcessedData] = useState<MeteoDataProcessed>();

    const [viewStatistics, setViewStatistics] = useState<GraphStatisticsDataType>({
        lines: {},
        dots: {}
    });

    const [rangeStatistics, setRangeStatistics] = useState<GraphStatisticsDataType>();

    const query = useQuery<MeteoQueryResponseType, MeteoRequestType>(METEO_DATA_QUERY, {

        variables: {
            scope: selection.scope,
            from: selection.fromTimestamp,
            to: selection.toTimestamp
        },

        onCompleted: data => {

            // Process the graph data
            const processedResponse = MeteoResponseProcessor.process(data);
            setProcessedData(processedResponse);

            // Process the view statistics
            const statistics = StatisticsProcessing.extractAllFromQuery(data);
            setViewStatistics(statistics);
        },

        onError: (e) => {
            console.error("error loading data", e, e.graphQLErrors, e.message);
        },

    });

    const client = useApolloClient();

    const refetchView = () => {
        console.log("refeč");
        client.resetStore();
        query.refetch();
    }


    const rangeQuery = useQuery<MeteoQueryResponseType>(METEO_RANGE_QUERY, {
        variables: {
            scope: selection.scope,
            from: selection.rangeMinTimestamp,
            to: selection.rangeMaxTimestamp
        },

        skip: !selection.hasRange,

        onCompleted: (data) => {
            const statistics = StatisticsProcessing.extractAllFromQuery(data);
            console.log(statistics);
            setRangeStatistics(statistics);
        },

        fetchPolicy: "network-only"


    });

    useEffect(() => {
        if (selection.hasRange === false && rangeStatistics) {
            setRangeStatistics(undefined);
        }
    }, [selection.hasRange, rangeStatistics]);


    return {
        selection,
        dispatch,
        refetch: refetchView,
        data: processedData,
        isLoadingData: query.loading,
        isLoadingRange: rangeQuery.loading,
        viewStatistics,
        rangeStatistics
    }

}

export type useMeteoDataReturnType = ReturnType<typeof useMeteoData>

export const useMeteoDataDefaults: useMeteoDataReturnType = {
    selection: MeteoStateFactory.defaultState(),
    dispatch: () => { },
    refetch: () => { },
    data: {},
    isLoadingData: false,
    isLoadingRange: false,
    viewStatistics: {
        lines: {},
        dots: {}
    },
    rangeStatistics: undefined
}