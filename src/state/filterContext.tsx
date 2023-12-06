"use client";

import { AvailableSources, Sources } from "@/graphql/weatherSources/source";
import { dateFromString, stringFromDate } from "@/utils/time";
import { addDays, format, subHours, subMonths } from "date-fns";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";



const getInitialFrom = () => stringFromDate(subHours(new Date, 24))
const getInitialTo = () => stringFromDate((new Date()))

export const getTimeMin = () => stringFromDate(subMonths(new Date, 12))
export const getTimeMax = () => stringFromDate(addDays(new Date, 5))

const getInitialLat = () => 4
const getInitialLon = () => 6

const getDefaultSources = () => Sources.all().map(s => s.slug);

type StringStateSetterType = Dispatch<SetStateAction<string>>;

type FilterContextType = {

    from: string,
    setFrom: Dispatch<SetStateAction<string>>,

    to: string,
    setTo: Dispatch<SetStateAction<string>>,

    lat: number,
    lon: number,
    sources: AvailableSources[],
    toggleSource: (source: AvailableSources) => void,

    isSelectingReference: boolean,
    setisSelectingReference: Dispatch<SetStateAction<boolean>>,

    fromReferenceCoordinate?: number,
    toReferenceCoordinate?: number,

    setFromReferenceCoordinate: Dispatch<SetStateAction<number|undefined>>,
    setToReferenceCoordinate: Dispatch<SetStateAction<number|undefined>>

}

const initialFrom = getInitialFrom();

const initial: FilterContextType = {
    from: getInitialFrom(),
    to: getInitialTo(),
    setFrom: () => { },
    setTo: () => { },
    lat: getInitialLat(),
    lon: getInitialLon(),
    sources: getDefaultSources(),
    toggleSource: (source: AvailableSources) => { },
    setFromReferenceCoordinate: () => { },
    setToReferenceCoordinate: () => { },
    isSelectingReference: false,
    setisSelectingReference: () => { }
}



const FilterContext = createContext(initial);

export const FilterContextProvider: React.FC<React.PropsWithChildren> = (props) => {

    const [from, setFrom] = useState<string>(getInitialFrom());
    const [to, setTo] = useState<string>(getInitialTo());

    const [lon, setLat] = useState<number>(getInitialLat());
    const [lat, setLon] = useState<number>(getInitialLon());

    const [sources, setSources] = useState<AvailableSources[]>(getDefaultSources());

    const [fromReferenceCoordinate, setFromReferenceCoordinate] = useState<number>();
    const [toReferenceCoordinate, setToReferenceCoordinate] = useState<number>();
    const [isSelectingReference, setIsSelectingReference] = useState<boolean>(false);

    const toggleSource = (source: AvailableSources) => {
        if (sources.includes(source as string))
            setSources(sources.filter(s => s !== source));
        else {
            setSources([...sources, source]);
        }
    }

    const value: FilterContextType = {
        from,
        to,
        setFrom,
        setTo,
        sources,
        toggleSource,
        lat,
        lon,
        fromReferenceCoordinate,
        setFromReferenceCoordinate,
        toReferenceCoordinate,
        setToReferenceCoordinate,
        isSelectingReference,
        setIsSelectingReference,
    }

    return <FilterContext.Provider value={value}>
        {props.children}
    </FilterContext.Provider>
}

export const useFilterContext = () => {
    return useContext(FilterContext);
}