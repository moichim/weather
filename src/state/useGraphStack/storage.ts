import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties"
import { GraphTools } from "./tools";
import { WeatherProperty } from "@/graphql/weatherSources/properties";
import { Properties } from "@/graphql/weatherSources/properties";

export enum GraphDomain {
    DEFAULT = "default",
    AUTO = "auto",
    MANUAL = "manual"
}

export const graphInstanceHeights = {
    sm: 100, 
    md: 250, 
    lg: 500, 
    xl: 750, 
    "2xl": 1000
};

export type GraphInstanceScales = keyof typeof graphInstanceHeights;

export type GraphInstanceState = {
    weight: number,
    scale: GraphInstanceScales,
    domain: GraphDomain,
    domainMin?: number,
    domainMax?: number,
    isSelecting: boolean,
    /** @deprecated should be flat, so is is advided this is converted into string */
    property: WeatherProperty
}

export type GraphStackState = {
    scale: GraphInstanceScales,
    isSelecting: boolean,
    selectionStart?: number,
    selectionEnd?: number,
    activeTool: GraphTools,
    graphs: {
        [T in AvailableWeatherProperties]?: GraphInstanceState
    }
    availableGraphs: WeatherProperty[]
}

export class GraphStateFactory {

    public static defaultState(
        properties: AvailableWeatherProperties[] = [ "temperature", "radiance", "humidity", "bar" ]
    ): GraphStackState {
        return {
            scale: "md",
            isSelecting: false,
            activeTool: GraphTools.INSPECT,
            graphs: Object.fromEntries( properties.map( property => {
                const definition = GraphStateFactory.defaultInstanceState(property);
                return [ property, definition ];
            } ) ),
            selectionStart: undefined,
            selectionEnd: undefined,
            availableGraphs: Properties.all().filter( property => ! properties.includes( property.slug ) )

        }
    }

    public static defaultInstanceState( 
        property: AvailableWeatherProperties,
        height: GraphInstanceScales = "md",
        weight: number = 999
    ): GraphInstanceState {
        const definition = Properties.one( property );
        return {
            property: definition,
            weight: weight,
            domain: GraphDomain.DEFAULT,
            domainMin: definition.min,
            domainMax: definition.max,
            isSelecting: false,
            scale: height
        }
    }

}