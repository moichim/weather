import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useFilterContext } from "@/state/filterContext"
import { useGraphContext } from "@/state/useGraphStack/graphStackContext"
import { useMemo, useState } from "react"

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

    const property = useMemo(() => {
        return Properties.one( prop );
    }, [prop]);


    const [isHovering, setIsHovering] = useState<boolean>( false );
    
    const {isSelecting} = stack.state;

    const [ rows, setRows ] = useState<ReferenceRow[]>([]);


    return {
        property,
        filter,
        isHovering, setIsHovering,
        isSelecting,
        tableData: rows
    }

}

export type UseGraphStackInstanceType = ReturnType< typeof useGraphStackInstance>;