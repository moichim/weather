import { useReducer, useState } from "react"
import { meteoReducer } from "./reducerInternals/reducer";
import { MeteoQueryResponseType, MeteoRequestType, METEO_DATA_QUERY } from "./data/query";
import { useApolloClient, useQuery } from "@apollo/client";
import { MeteoStateFactory } from "./data/meteoStateFactory";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";

/** Hook used by reducer. DO NOT USE IN COMPONENTS! */
export const useMeteoData = () => {

    const [selection, dispatch] = useReducer( meteoReducer, MeteoStateFactory.defaultState() );

    const [ processedData, setProcessedData ] = useState<MeteoDataProcessed>();

    const query = useQuery<MeteoQueryResponseType, MeteoRequestType>(METEO_DATA_QUERY, {

        variables: {
            scope: selection.scope,
            from: selection.fromInternalString,
            to: selection.toInternalString
        },

        onCompleted: data => {
            const processedResponse = MeteoResponseProcessor.process( data );
            setProcessedData( processedResponse );
        },

        onError: e => {
            console.error( "error loading data", e );
        },

    });

    const client = useApolloClient();

    const refetch = () => {
        console.log( "refeč" );
        client.resetStore();
        query.refetch();
    }

    console.log( query.data );

    return {
        selection,
        dispatch,
        refetch,
        data: processedData
    }

}

export type useMeteoDataReturnType = ReturnType<typeof useMeteoData>

export const useMeteoDataDefaults: useMeteoDataReturnType = {
    selection: MeteoStateFactory.defaultState(),
    dispatch: () => {},
    refetch: () => {},
    data: {}
}