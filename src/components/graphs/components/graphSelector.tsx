"use client";

import { AvailableWeatherProperties } from "@/graphql/weather/definitions/properties";
import { Sources } from "@/graphql/weather/definitions/source";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { useMeteoContext } from "@/state/meteo/meteoContext";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from "@nextui-org/react";

const itemBargeDimension = 10;
const badgeWidth = Sources.all().length * itemBargeDimension;

export const GraphSelector: React.FC<GraphInstanceState> = props => {

    const {graphState, graphDispatch} = useGraphContext();

    const meteo = useMeteoContext();

    if ( meteo.data === undefined ) {
        return <Skeleton className="rounded-xl w-40 h-10 bg-gray-400" />
    }

    return <Dropdown id={`graph${props.id}selector`}>
        <DropdownTrigger>
            <Button
                variant="light"
                className="bg-white graph-selector z-0"
            >
                {props.property.name}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Přepnout vlastnost"
            onAction={(selection) => {
                graphDispatch( StackActions.setInstanceProperty( props.property.slug, selection as AvailableWeatherProperties ) );
            }}
        >
            {graphState.availableGraphs.map(prop => {
                return <DropdownItem key={prop.slug}>
                    {prop.name}
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>;

}