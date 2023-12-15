import { useReducer, useState } from "react"
import { meteoReducer } from "./reducerInternals/reducer";
import { MeteoQueryResponseType, MeteoRequestType, METEO_DATA_QUERY } from "./data/query";
import { useApolloClient, useQuery } from "@apollo/client";
import { MeteoStateFactory } from "./data/meteoStateFactory";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";
import { GraphStatisticsDataType, StatisticsProcessing } from "./data/statisticsProcessing";

/** Hook used by reducer. DO NOT USE IN COMPONENTS! */
export const useMeteoData = () => {

    const [selection, dispatch] = useReducer( meteoReducer, MeteoStateFactory.defaultState() );

    const [ processedData, setProcessedData ] = useState<MeteoDataProcessed>();

    const [ viewStatistics, setViewStatistics ] = useState<GraphStatisticsDataType>({
        lines: {},
        dots: {}
    });

    const query = useQuery<MeteoQueryResponseType, MeteoRequestType>(METEO_DATA_QUERY, {

        variables: {
            scope: selection.scope,
            from: selection.fromTimestamp,
            to: selection.toTimestamp
        },

        onCompleted: data => {

            // Process the graph data
            const processedResponse = MeteoResponseProcessor.process( data );
            setProcessedData( processedResponse );

            // Process the view statistics
            const vs = StatisticsProcessing.extractAllFromQuery( data );
            setViewStatistics( vs );
        },

        onError: (e) => {
            console.error( "error loading data", e, e.graphQLErrors, e.message);
        },

    });

    const client = useApolloClient();

    const refetch = () => {
        console.log( "refeč" );
        client.resetStore();
        query.refetch();
    }

    return {
        selection,
        dispatch,
        refetch,
        data: processedData,
        isLoading: query.loading,
        viewStatistics
    }

}

export type useMeteoDataReturnType = ReturnType<typeof useMeteoData>

export const useMeteoDataDefaults: useMeteoDataReturnType = {
    selection: MeteoStateFactory.defaultState(),
    dispatch: () => {},
    refetch: () => {},
    data: {},
    isLoading: false,
    viewStatistics: {
        lines: {},
        dots: {}
    }
}