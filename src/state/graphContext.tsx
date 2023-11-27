import { WeatherEntryDataType } from "@/graphql/weather"
import { createContext, useContext, useState } from "react"

enum GraphMode {
    COMBINED = 1,
    SINGLE = 1
}

type GraphContextType = {

    mode: GraphMode,
    setMode: ( mode: GraphMode ) => void,
    single: {
        properties: {
            [T in keyof WeatherEntryDataType]: boolean
        },
        setProperty: ( property: keyof WeatherEntryDataType, state: boolean ) => void
    }

}

const initialData: GraphContextType = {
    mode: GraphMode.SINGLE,
    setMode: () => {},
    single: {
        properties: {
            temperature: true,
            wind_dir: false,
            wind_speed: true,
            bar: true,
            rain: true,
            clouds: true,
            humidity: true,
            uv: true
        },
        setProperty: ( property, state ) => {}
    }
}

type PropertiesSettingsType = typeof initialData["single"]["properties"];

const GraphContext = createContext( initialData );

export const GraphContextProvider: React.FC<React.PropsWithChildren> = props => {

    const [ mode, setMode ] = useState<GraphMode>( GraphMode.SINGLE );

    const [ properties, setProperties ] = useState< {
        [T in keyof PropertiesSettingsType]: boolean
    } >( initialData.single.properties );

    const setProperty = ( property: keyof PropertiesSettingsType, state: boolean ) => {
        setProperties( propers => {
            return { 
                ...propers,
                [property]: state
            }
        } );
    };

    const value: GraphContextType = {
        mode: mode,
        setMode,
        single: {
            properties,
            setProperty
        }
    };

    return <GraphContext.Provider value={value}>
        {props.children}
    </GraphContext.Provider>
}

export const useGraphContext = () => {
    return useContext( GraphContext );
}