import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties"
import { useDisplayContext } from "@/state/displayContext"
import { useFilterContext } from "@/state/filterContext"
import { useGraphScale } from "@/state/useGraphScale"
import { prepareGraphData, useWeatherContext } from "@/state/weatherContext"
import { useEffect, useMemo, useState, useCallback } from "react"

export type PropertyGraphPropsType = {
    prop: AvailableWeatherProperties
}


export enum PropertyGraphModes {
    RECOMMENDED = "1",
    MANUAL = "2",
    NONE = "3"
}

export type PropertyGraphWithStateType = PropertyGraphPropsType & ReturnType<typeof useGraphInstance>;

type ReferenceRow = {
    name: string,
    min: number,
    max: number,
    average: number,
    color: string
    count: number
}

export const useGraphInstance = ( prop: AvailableWeatherProperties ) => {

    const { set: display } = useDisplayContext();

    const filter = useFilterContext();

    const apiData = useWeatherContext();

    const property = useMemo(() => {
        return display.allProps[prop];
    }, [prop, display.allProps]);

    const [ min, setMin ] = useState<number|undefined>(property.min);
    const [ max, setMax ] = useState<number|undefined>(property.max);
    const [ domain, setDomain ] = useState<PropertyGraphModes>( PropertyGraphModes.RECOMMENDED );

    const scale = useGraphScale();

    useEffect( () => {
        if ( domain === PropertyGraphModes.RECOMMENDED ) {
            setMin( property.min );
            setMax( property.max );
        }
    }, [domain, property] );

    const data = useMemo(()=> prepareGraphData( prop, apiData.data ?? {weatherRange: [], valueRange: []} ), [ prop, apiData.data ]);


    const [isHovering, setIsHovering] = useState<boolean>( false );
    
    const {isSelecting, setIsSelecting} = display;

    const [ rows, setRows ] = useState<ReferenceRow[]>([]);

    const calculateRows = useCallback( () => {

        if ( display.reference === undefined )
            return [];

        const values = data.dots.map( dot => {

            const selection = dot.values.filter( value => {
                return value.time >= display.reference!.from
                    && value.time <= display.reference!.to
            } );
    
            const min = selection.reduce( ( state, current ) => {
                if ( current.value < state )
                    return current.value;
                return state;
            }, Infinity );
    
            const max = selection.reduce( ( state, current ) => {
                if ( current.value > state )
                    return current.value;
                return state;
            }, -Infinity );
    
            const average = selection.reduce( ( state, current ) => {
                return state + current.value;
            }, 0 ) / selection.length;
    
            return {
                name: dot.name,
                color: dot.color,
                min, max, average,
                count: selection.length
            } as ReferenceRow
    
        } ).filter( row => row.count > 0 );
    
        const properties = data.lines.map( line => {
    
            const selection = data.data.filter( entry => {
                return entry["time"] >= display.reference!.from
                    && entry["time"] <= display.reference!.to
            } ).map( entry => entry[line.slug] );
    
            const min = selection.reduce( ( state, current ) => {
                if ( current < state ) return current;
                return state;
            }, Infinity );
    
            const max = selection.reduce( ( state, current ) => {
                if ( current > state ) return current;
                return state;
            }, -Infinity );
    
            const average = selection.reduce( ( state, current ) => {
                return state + current;
            }, 0 ) / selection.length;
    
            return {
                name: line.name,
                color: line.color,
                min, max, average,
                count: selection.length
            } as ReferenceRow
    
        } );

        return [...values, ...properties]

    }, [ display.reference, data.data, data.dots, data.lines ] );

    useEffect( () => {

        const timeout = setTimeout( () => {
            setRows( calculateRows() )
        }, 200 );

        return () => clearTimeout( timeout );

    }, [ display.reference, calculateRows ] );


    return {
        display: display,
        property,
        min, setMin,
        max, setMax,
        domain, setDomain,
        apiData,
        data,
        filter,
        scale,
        isHovering, setIsHovering,
        isSelecting, setIsSelecting,
        tableData: rows
    }

}