import { useReducer, useState } from "react"
import { meteoReducer } from "./reducerInternals/reducer";
import { MeteoQueryResponseType, MeteoRequestType, METEO_DATA_QUERY } from "./data/query";
import { useQuery } from "@apollo/client";
import { MeteoStateFactory } from "./meteoStateFactory";
import { MeteoDataProcessed, MeteoResponseProcessor } from "./data/responseProcessing";

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
            console.log( "refetched" );
            const processedResponse = MeteoResponseProcessor.process( data );
            // setProcessedData( processedResponse );
            console.log( "fetched data", data, processedResponse );
        },

        onError: e => {
            console.error( "error loading data", e );
        },

        canonizeResults: false

    });

    const refetch = () => {
        console.log( "refeč" );
        query.refetch();
    }

    console.log( query.data );

    return {
        selection,
        dispatch,
        refetch
    }

}

export type useMeteoDataReturnType = ReturnType<typeof useMeteoData>

export const useMeteoDataDefaults: useMeteoDataReturnType = {
    selection: MeteoStateFactory.defaultState(),
    dispatch: () => {},
    refetch: () => {}
}