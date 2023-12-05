import { SelectIcon, ZoomIcon } from "@/components/ui/icons";
import { ToolDefinitionType } from "@/components/ui/toolbar/toolbar";
import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useState, useCallback, useEffect, useMemo } from "react"

const properties = Properties.index();

const getDefaultActiveProperties = (): AvailableWeatherProperties[] => [
    "temperature", "radiance", "humidity", "wind_speed"
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

export enum Tool {
    SELECT = 1,
    ZOOM = 2
}

export const minHeight = 100;
export const maxHeight = 900;

type SharedReference = {
    from: number,
    to: number
}

export const useMultipleGraphs = () => {

    const [activeProps, setActiveProps] = useState<AvailableWeatherProperties[]>(getDefaultActiveProperties());

    const [availableProps, setAvailableProps] = useState<AvailableWeatherProperties[]>([]);

    const [ columns, setColumns ] = useState<MultipleGraphColumn>( MultipleGraphColumn.TWO );

    const [ referenceFrom, setReferenceFrom ] = useState<number|undefined>();
    const [ referenceTo, setReferenceTo ] = useState<number|undefined>();

    const [ reference, setReference ] = useState<undefined|SharedReference>();

    const [ tool, setTool ] = useState<Tool>( Tool.SELECT );

    const toolbar = useMemo( () => {

        return [
            {
                slug: Tool.SELECT,
                name: "Označení rozsahu",
                tooltip: "Označte oblast v grafu a zobrazte analýzy",
                icon: SelectIcon,
                onActivate: () => {
                    setTool( Tool.SELECT )
                }
            },
            {
                slug: Tool.ZOOM,
                name: "Přiblížit rozsah",
                tooltip: "Vyberte oblast a přibližte ji",
                icon: ZoomIcon,
                onActivate: () => {
                    setTool( Tool.ZOOM )
                }
            }
        ] as ToolDefinitionType[]

    }, [ tool ] );

    const [ height, setHeight ] = useState<number>( 350 );

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

    }, [activeProps]);

    return {
        activeProps,
        availableProps,
        allProps: properties,
        replaceProp: replaceProp.bind(this),
        addProp: addProp.bind(this),
        columns,
        setColumns,
        height,
        setHeight,
        tool,
        setTool,
        toolbar,
        reference,
        setReference
    }

}

export const getMultipleGraphsDefaults = (): MultipleGraphsHookType => {
    return {
        activeProps: [],
        availableProps: [],
        allProps: properties,
        addProp: () => {},
        replaceProp: () => {},
        columns: MultipleGraphColumn.TWO,
        setColumns: () => {},
        height: 500,
        setHeight: () => {},
        tool: Tool.SELECT,
        setTool: () => {},
        toolbar: [],
        reference: undefined,
        setReference: () => {}
    }
}