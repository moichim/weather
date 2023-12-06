import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties"
import { useDisplayContext } from "@/state/displayContext"
import { useFilterContext } from "@/state/filterContext"
import { prepareGraphData, useWeatherContext } from "@/state/weatherContext"
import { useEffect, useMemo, useState } from "react"

export type PropertyGraphPropsType = {
    prop: AvailableWeatherProperties
}

export enum PropertyGraphModes {
    RECOMMENDED = "1",
    MANUAL = "2",
    NONE = "3"
}

export type PropertyGraphWithStateType = PropertyGraphPropsType & ReturnType<typeof useGraphInstance>;

export const useGraphInstance = ( prop: AvailableWeatherProperties ) => {

    const { grid: display } = useDisplayContext();

    const filter = useFilterContext();

    const apiData = useWeatherContext();

    const property = useMemo(() => {
        return display.allProps[prop];
    }, [prop, display.allProps]);

    const [ min, setMin ] = useState<number|undefined>(property.min);
    const [ max, setMax ] = useState<number|undefined>(property.max);
    const [ domain, setDomain ] = useState<PropertyGraphModes>( PropertyGraphModes.RECOMMENDED );

    useEffect( () => {
        if ( domain === PropertyGraphModes.RECOMMENDED ) {
            setMin( property.min );
            setMax( property.max );
        }
    }, [domain, property] );

    const data = useMemo(()=> prepareGraphData( prop, apiData.data ?? {weatherRange: [], valueRange: []} ), [ prop, apiData.data ]);

    return {
        display: display,
        property,
        min, setMin,
        max, setMax,
        domain, setDomain,
        apiData,
        data,
        filter
    }

}