import { SelectIcon, ZoomInIcon } from "@/components/ui/icons";
import { ToolDefinitionType } from "@/components/ui/toolbar/toolbar";
import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useState, useCallback, useEffect, useMemo, SetStateAction } from "react"
import { useGraphScale } from "./useGraphScale";

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
    INSPECT = 0,
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
                icon: ZoomInIcon,
                onActivate: () => {
                    setTool( Tool.ZOOM )
                }
            }
        ] as ToolDefinitionType[]

    }, [] );

    const [ height, setHeight ] = useState<number>( 350 );

    useEffect(() => {

        const updatedValue = getRemainingProperties(activeProps);
        setAvailableProps(updatedValue);

    }, [activeProps]);

    const scale = useGraphScale();

    const [isSelecting, setIsSelecting] = useState<boolean>(false);

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
        setReference,
        scale,
        isSelecting,
        setIsSelecting
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
        setReference: () => {},
        scale: {
            scaleUp: undefined,
            scaleDown: undefined,
            height: 0,
            setScale: function (value: SetStateAction<number>): void {
                throw new Error("Function not implemented.");
            }
        },
        isSelecting: false,
        setIsSelecting: () => {}
    }
}