import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useState, useCallback, useEffect } from "react"

const properties = Properties.index();

const getDefaultActiveProperties = (): AvailableWeatherProperties[] => [
    "temperature", "clouds"
];

const getRemainingProperties = (active: AvailableWeatherProperties[]): AvailableWeatherProperties[] => {
    return Object.values(properties)
        .filter(prop => !active.includes(prop.slug))
        .map(prop => prop.slug);
}

export type MultipleGraphsHookType = ReturnType<typeof useMultipleGraphs>;

export enum MultipleGraphColumn {
    ONE = 1,
    TWO = 2,
    THREE = 3
}

export const minHeight = 100;
export const maxHeight = 900;

export const useMultipleGraphs = () => {

    const [activeProps, setActiveProps] = useState<AvailableWeatherProperties[]>(getDefaultActiveProperties());

    const [availableProps, setAvailableProps] = useState<AvailableWeatherProperties[]>([]);

    const [ columns, setColumns ] = useState<MultipleGraphColumn>( MultipleGraphColumn.TWO );

    const [ height, setHeight ] = useState<number>( 500 );

    useEffect(() => {

        const updatedValue = getRemainingProperties(activeProps);
        setAvailableProps(updatedValue);

    }, [activeProps]);

    const replaceProp = useCallback((
        old: AvailableWeatherProperties,
        next: AvailableWeatherProperties
    ) => {

        if (activeProps.includes(old)) {

            const updatedProps = activeProps.map(prop => {
                if (prop === old) {
                    return next;
                }
                return prop;
            });

            setActiveProps(updatedProps);

        }

    }, [activeProps]);

    const addProp = useCallback((newPropSlug: AvailableWeatherProperties) => {

        if (!activeProps.includes(newPropSlug)) {

            const updatedValue = [...activeProps, newPropSlug];
            setActiveProps(updatedValue);

        }

    }, []);

    return {
        activeProps,
        availableProps,
        allProps: properties,
        replaceProp: replaceProp.bind(this),
        addProp: addProp.bind(this),
        columns,
        setColumns,
        height,
        setHeight
    }

}

export const useMultipleGraphsDefaults = (): MultipleGraphsHookType => {
    return {
        activeProps: [],
        availableProps: [],
        allProps: properties,
        addProp: () => {},
        replaceProp: () => {},
        columns: MultipleGraphColumn.TWO,
        setColumns: () => {},
        height: 500,
        setHeight: () => {}
    }
}