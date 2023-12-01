"use client";

import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useWeatherContext } from "@/state/weatherContext";
import { useDisplayContext } from "@/state/displayContext"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@nextui-org/react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { format } from "date-fns";
import { Sources } from "@/graphql/weatherSources/source";
import { MultipleGraphColumn } from "@/state/useMultipleGraphs";
import { useFilterContext } from "@/state/filterContext";
import { PropertyGraphHeader as PropertyGraphSelector } from "./propertyGraphSelector";
import { PropertyGraphChart } from "./propertyGraphChart";
import { PropertyGraphSettings } from "./propertyGraphSettings";

export type PropertyGraphPropsType = {
    prop: AvailableWeatherProperties
}

export type PropertyGraphWithStateType = PropertyGraphPropsType & {
    min?: number,
    max?: number,
    domain: PropertyGraphModes,
    setDomain: Dispatch<SetStateAction<PropertyGraphModes>>,
    setMin: Dispatch<SetStateAction<number|undefined>>,
    setMax: Dispatch<SetStateAction<number|undefined>>
}

export enum PropertyGraphModes {
    RECOMMENDED = "1",
    MANUAL = "2",
    NONE = "3"
}

export const PropertyGraph: React.FC<PropertyGraphPropsType> = props => {

    const { grid: graph } = useDisplayContext();

    const property = useMemo(() => {
        return graph.allProps[props.prop];
    }, [props.prop, graph.allProps]);

    const [ min, setMin ] = useState<number|undefined>(property.min);
    const [ max, setMax ] = useState<number|undefined>(property.max);
    const [ domain, setDomain ] = useState<PropertyGraphModes>( PropertyGraphModes.RECOMMENDED );

    useEffect( () => {
        if ( domain === PropertyGraphModes.RECOMMENDED ) {
            setMin( property.min );
            setMax( property.max );
        }
    }, [domain, property] );

    return <div className={cn([
        "w-full p-10",
        graph.columns === MultipleGraphColumn.ONE
            ? "lg:w-full"
            : graph.columns === MultipleGraphColumn.TWO
                ? "lg:w-1/2"
                : "lg:w-1/3"
    ])} >
        <div className="pb-5 flex items-center justify-center gap-3">
            <PropertyGraphSelector prop={props.prop} />
            <PropertyGraphSettings prop={props.prop} min={min} max={max} domain={domain} setMin={setMin} setMax={setMax} setDomain={setDomain}/>
        </div>
        <div>
            <PropertyGraphChart prop={props.prop} min={min} max={max} domain={domain} setMin={setMin} setMax={setMax} setDomain={setDomain}/>
        </div>
    </div>
}