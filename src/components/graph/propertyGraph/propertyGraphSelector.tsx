"use client";

import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties";
import { useDisplayContext } from "@/state/displayContext";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { useMemo } from "react";
import { PropertyGraphPropsType } from "./propertyGraph";
import { useWeatherContext } from "@/state/weatherContext";
import { Sources } from "@/graphql/weatherSources/source";

const itemBargeDimension = 10;
const badgeWidth = Sources.all().length * itemBargeDimension;

export const PropertyGraphHeader: React.FC<PropertyGraphPropsType> = props => {

    const { grid: graph } = useDisplayContext();

    const { loading } = useWeatherContext();

    const property = useMemo(() => {
        return graph.allProps[props.prop];
    }, [props.prop, graph.allProps]);

    return <Dropdown>
        <DropdownTrigger>
            <Button
                variant="bordered"
            >
                {property.name}
                {loading && <Spinner size="sm" color="default"/>}
                {!loading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                }
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Přepnout vlastnost"
            onAction={(selection) => {
                graph.replaceProp(props.prop, selection as AvailableWeatherProperties)
            }}
        >
            {graph.availableProps.map(prop => {
                const p = graph.allProps[prop]!;
                return <DropdownItem key={prop}>
                    <div className="flex w-full">
                        <div 
                            style={{width: badgeWidth + "px"}}
                            className="w-full flex items-center justify-center mr-4"
                        >
                            {p.in.map( s => <div key={s} className="rounded-full" style={{
                                backgroundColor: Sources.one( s as any ).stroke,
                                width: itemBargeDimension + "px",
                                height: itemBargeDimension + "px"
                            }}></div> )}
                        </div>
                        <div>{p.name}</div>
                    </div>
                     {p.in.map( pr => Properties.one( pr as any ).color )}
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>;

}