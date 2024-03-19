import { GoogleScope } from "@/graphql/google/google";
import { useGraphData } from "./useGraphData";
import { useGraphStatistics } from "./useGraphStatitics";
import { useTimeContext } from "../time/timeContext";
import { useEffect } from "react";

export const useData = (
    scope: GoogleScope
) => {

    // Read the time
    const { timeState: time } = useTimeContext();

    // Initialise the queries
    const graphData = useGraphData( scope );
    const viewStats = useGraphStatistics( scope );
    const selectionStats = useGraphStatistics( scope );

    // Fire the initial query
    useEffect( () => {

        graphData.fetch( time.from, time.to );

    }, [] );



    // Hook the range change to the main data query
    useEffect( () => {

        graphData.fetch( time.from, time.to );
        viewStats.clear();
        selectionStats.clear();

    }, [ time.from, time.to ] );



    // The main query response triggers loading of the statistics
    useEffect( () => {

        if ( graphData.data !== undefined ) {
            viewStats.fetch( time.from, time.to );
        }

    }, [ graphData.data ] );



    // Change of the selection triggers request for a statistic
    useEffect( () => {

        if ( time.selectionFrom !== undefined && time.selectionTo !== undefined ) {
            selectionStats.fetch( time.selectionFrom, time.selectionTo );
        }

    }, [ time.selectionFrom, time.selectionTo ] );



    const loading = graphData.loading || viewStats.loading || selectionStats.loading;

    return {
        loading,
        graphData,
        viewStats,
        selectionStats
    }



}