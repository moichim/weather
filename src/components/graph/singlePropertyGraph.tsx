"use client";

import { AvailableWeatherProperties, Properties } from "@/graphql/weatherSources/properties"
import { useDataContext } from "@/state/dataContext";
import { useGraphContext } from "@/state/graphContext"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@nextui-org/react";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {format} from "date-fns";
import { Sources } from "@/graphql/weatherSources/source";
import { MultipleGraphColumn } from "@/state/useMultipleGraphs";

type SinglePropertyGraphPropsType = {
    prop: AvailableWeatherProperties
}

const properties = Properties.index();

export const SinglePropertyGraph: React.FC<SinglePropertyGraphPropsType> = props => {

    const { multiple: graph } = useGraphContext();

    const property = useMemo( () => {
        return graph.allProps[ props.prop ];
    }, [ props.prop, graph.allProps ] );
    

    const content = useDataContext();


    const data: Array<any> = [];


    if ( content.data )
    if ( content.data!.weatherRange.length > 0 ) {

        content.data?.weatherRange[0].entries.forEach( (e,i) => {

            const entry = {
                time: e.time
            } as any;

            content.data?.weatherRange.forEach( serie => {

                entry[serie.source.slug] = serie.entries[i][props.prop];

            } );

            data.push( entry );

        } );

    }

    return <div className={cn([
        "w-full p-10",
        graph.columns === MultipleGraphColumn.ONE
            ? "lg:w-full"
            : graph.columns === MultipleGraphColumn.TWO 
                ? "lg:w-1/2"
                : "lg:w-1/3"
    ])} >
        <div className="pb-5">
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                    >
                        {property.name}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Přepnout vlastnost"
                    onAction={(selection) => {
                        graph.replaceProp( props.prop, selection as AvailableWeatherProperties )
                    } }
                >
                {graph.availableProps.map( prop => {
                    const p = graph.allProps[prop]!;
                    return <DropdownItem key={prop}>{p.name}</DropdownItem>
                } )}
                </DropdownMenu>
            </Dropdown>
        </div>
        <div>
        <ResponsiveContainer width={"100%"} height={graph.height}>
            <LineChart data={data}>
                {content.data?.weatherRange.map( d => <Line 
                    type="monotone" 
                    dataKey={d.source.slug} 
                    unit={" " + property.unit}
                    dot={false}
                    
                /> )}
                <CartesianGrid />
                <XAxis 
                    dataKey="time" 
                    label="Čas" 
                    angle={90}
                    // tickCount={5}
                    tickFormatter={ name => {
                        return format( new Date(name), "h:mm" )
                    } }
                    minTickGap={20}
                />
                <YAxis/>
                <Tooltip 
                    formatter={(value: number, name, props) => {
                        return [value.toFixed(3), Sources.one(name).name];
                    }}
                    labelFormatter={(value) => {
                        return format( new Date( value ), "d. M. Y h:mm" );
                    }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
}