import { GoogleColumn, GoogleColumnStats, GoogleScope } from "@/graphql/google/google";
import { AvailableWeatherProperties, WeatherProperty } from "@/graphql/weather/definitions/properties";
import { WeatherSourceType } from "@/graphql/weather/definitions/source";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphDomain, GraphInstanceScales, GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { useGraphInternal } from "@/state/graph/useGraphInternal";
import { BufferEntryType } from "@/state/data/processors/responseProcessing";
import { useMemo } from "react";
import { useData } from "../useData";
import { useGraphContext } from "@/state/graph/graphContext";

export type GraphInstanceHeightSetter = (height: GraphInstanceScales) => void;

export type GraphInstanceDomainSetter = (domain: GraphDomain, min?: number | "auto", max?: number | "auto") => void;

export type GraphInstancePropertySetter = (property: AvailableWeatherProperties) => void;

export type GraphInstanceProps = {
    
    graphData?: {
        dots: GoogleColumn[],
        lines: WeatherSourceType[],
        data: BufferEntryType[]
    },

    viewStats?: GoogleColumnStats[],
    viewStatsLoading: boolean,
    
    state: GraphInstanceState,
    
    setProperty: GraphInstancePropertySetter,
    
    setHeight: GraphInstanceHeightSetter,

    setDomain: GraphInstanceDomainSetter,

    availableProperties: WeatherProperty[],

    loadingData: boolean,
    loadingAnything: boolean

}

export const useDataContextInternal = (
    scope: GoogleScope
) => {

    const data = useData( scope );

    const graph = useGraphContext();

    const instances = useMemo( (): GraphInstanceProps[] => {

        return Object.values( graph.graphState.graphs ).map( instance => {

            const graphData = data.graphData.data
                ? data.graphData.data[ instance.property.slug ]
                : undefined;

            // const viewStatsData: 
            let viewStats: GoogleColumnStats[] | undefined = undefined;

            let viewStatsLoading = data.viewStats.loading;

            // View Statistics
            if ( data.viewStats.data ) {
                
                // Google Statistics
                const statistics = Object.values( data.viewStats.data.dots ).filter( dot => dot.in.slug === instance.property.slug ).filter( dot => dot.count > 0 );

                // MeteoStatistics
                const lines = Object.values( data.viewStats.data.lines ).filter( line => line.in.slug === instance.property.slug ).filter( line => line.count > 0 );

                viewStats = [
                    ...statistics,
                    ...lines
                ]

            }


            const availableProperties = graph.graphState.availableGraphs.filter( property => {

                if ( property.slug === instance.property.slug ) {
                    return false;
                }

                if ( graph.graphState.graphs[ property.slug ] !== undefined ) { 
                    return false;
                }

                return true;

            } );

            const state = instance;

            const setProperty = ( 
                property: AvailableWeatherProperties 
            ) => graph.graphDispatch( StackActions.setInstanceProperty( 
                instance.property.slug, 
                property 
            ) );

            const setHeight = (
                height: GraphInstanceScales
            ) => {
                graph.graphDispatch( StackActions.setInstanceHeight( 
                    instance.property.slug,
                    height
                ) )
            }

            const setDomain = (
                domain: GraphDomain,
                min?: number|"auto",
                max?: number|"auto"
            ) => {
                graph.graphDispatch( StackActions.setInstanceDomain(
                    instance.property.slug,
                    domain,
                    min,
                    max
                ) );
            }

            return {
                graphData,
                state,
                setProperty,
                setHeight,
                setDomain,
                availableProperties,
                loadingData: data.loading,
                loadingAnything: false,
                viewStats,
                viewStatsLoading
            }

        } );


    }, [ 
        data.graphData,
        data.viewStats.data,
        data.loading,
        graph.graphState.graphs,
        graph.graphDispatch
    ] );

    return {
        data,
        graph,
        instances
    }

}