"use client"

import { WeatherSourceType } from "@/graphql/weatherSources/source";
import { useFilterContext } from "@/state/filterContext";
import { Switch } from "@nextui-org/react";

export const SourceButton: React.FC<WeatherSourceType> = (props) => {

    const filter = useFilterContext();

    const isEnabled = filter.sources.includes(props.slug);

    const color = isEnabled ? props.color : undefined;

    return <Switch 
        isSelected={isEnabled} 
        onValueChange={value => filter.toggleSource( props.slug )}
        className="pr-5"
    >{props.name}</Switch>

}