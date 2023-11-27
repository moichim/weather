"use client";

import { AvailableSources, Sources } from "@/graphql/weatherSources/source"
import { subHours } from "date-fns"
import { Dispatch, SetStateAction, createContext, useContext, useReducer, useState } from "react";


const getInitialFrom = () => subHours( new Date, 24 )
const getInitialTo = () => new Date();

const getInitialLat = () => 4
const getInitialLon = () => 6

const getDefaultSources = () => Sources.all().map(s=>s.slug);

type FilterContextType = {
    from: Date,
    to: Date,
    setFrom: Dispatch<SetStateAction<Date>>,
    setTo: Dispatch<SetStateAction<Date>>,
    lat: number,
    lon: number,
    sources: AvailableSources[],
    toggleSource: ( source: AvailableSources ) => void
}

const initial: FilterContextType = {
    from: getInitialFrom(),
    to: getInitialTo(),
    setFrom: () => {},
    setTo: () => {},
    lat: getInitialLat(),
    lon: getInitialLon(),
    sources: getDefaultSources(),
    toggleSource: ( source: AvailableSources ) => {}
}



const FilterContext = createContext( initial );

export const FilterContextProvider: React.FC<React.PropsWithChildren> = ( props ) => {

    const [from, setFrom] = useState<Date>( getInitialFrom() );
    const [to, setTo] = useState<Date>( getInitialTo() );
    
    const [lon, setLat] = useState<number>( getInitialLat() );
    const [lat, setLon] = useState<number>( getInitialLon() );

    const [sources, setSources] = useState<AvailableSources[]>( getDefaultSources() );

    const toggleSource = ( source: AvailableSources ) => {
        if ( sources.includes(source as string) )
            setSources( sources.filter( s => s !== source ) );
        else {
            setSources( [...sources, source ] );
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
        lon
    }

    return <FilterContext.Provider value={value}>
        {props.children}
    </FilterContext.Provider>
}

export const useFilterContext = () => {
    return useContext( FilterContext );
}