import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useDisplayContext } from "@/state/displayContext"
import { useFilterContext } from "@/state/filterContext"
import { useGraphContext } from "@/state/graphStackContext"
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

export type PropertyGraphWithStateType = PropertyGraphPropsType & ReturnType<typeof useGraphStackInstance>;

type ReferenceRow = {
    name: string,
    min: number,
    max: number,
    average: number,
    color: string
    count: number
}

export const useGraphStackInstance = ( prop: AvailableWeatherProperties ) => {

    const {stack} = useGraphContext();

    const filter = useFilterContext();

    const apiData = useWeatherContext();

    const property = useMemo(() => {
        return Properties.one( prop );
    }, [prop]);

    const data = useMemo(()=> prepareGraphData( prop, apiData.data ?? {weatherRange: [], valueRange: []} ), [ prop, apiData.data ]);


    const [isHovering, setIsHovering] = useState<boolean>( false );
    
    const {isSelecting} = stack.state;

    const [ rows, setRows ] = useState<ReferenceRow[]>([]);

    const calculateRows = useCallback( () => {

        if ( !stack.state.selectionStart && !stack.state.selectionEnd )
            return [];

        const values = data.dots.map( dot => {

            const selection = dot.values.filter( value => {
                return value.time >= stack.state.selectionStart!
                    && value.time <= stack.state.selectionEnd!
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
                return entry["time"] >= stack.state.selectionStart!
                    && entry["time"] <= stack.state.selectionEnd!
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
                color: line.stroke,
                min, max, average,
                count: selection.length
            } as ReferenceRow
    
        } );

        return [...values, ...properties]

    }, [ stack.state.selectionStart, stack.state.selectionEnd, data.data, data.dots, data.lines ] );

    useEffect( () => {

        // const timeout = setTimeout( () => {
            setRows( calculateRows() )
        // }, 200 );

        // return () => clearTimeout( timeout );

    }, [ stack.state.selectionStart, stack.state.selectionEnd, calculateRows ] );


    return {
        //display: display,
        property,
        apiData,
        data,
        filter,
        isHovering, setIsHovering,
        isSelecting,
        tableData: rows
    }

}

export type UseGraphStackInstanceType = ReturnType< typeof useGraphStackInstance>;