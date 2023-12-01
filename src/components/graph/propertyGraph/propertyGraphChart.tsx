"use client";

import { Properties } from "@/graphql/weatherSources/properties";
import { Sources } from "@/graphql/weatherSources/source";
import { useDisplayContext } from "@/state/displayContext";
import { useFilterContext } from "@/state/filterContext";
import { useWeatherContext } from "@/state/weatherContext";
import { Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PropertyGraphModes, PropertyGraphWithStateType } from "./propertyGraph";

const properties = Properties.index();

export const PropertyGraphChart: React.FC<PropertyGraphWithStateType> = props => {
    const content = useWeatherContext();

    const { grid: graph } = useDisplayContext();

    const { sources } = useFilterContext();

    const property = useMemo(() => {
        return graph.allProps[props.prop];
    }, [props.prop, graph.allProps]);

    const data: Array<any> = useMemo(() => {

        const output: Array<any> = [];

        if (content.data)
            if (content.data!.weatherRange.length > 0) {

                const leadingSerie = content.data.weatherRange.length === 1
                    ? content.data.weatherRange[0]
                    : content.data.weatherRange[0];

                leadingSerie.entries.forEach((e, i) => {

                    const entry = {
                        time: e.time
                    } as any;

                    content.data?.weatherRange.forEach(serie => {

                        if (sources.includes(serie.source.slug))
                            if (properties[props.prop].in.includes(serie.source.slug))
                                entry[serie.source.slug] = serie.entries[i][props.prop];

                    });

                    output.push(entry);

                });

            }

        return output;

    }, [content]);

    const domain = props.domain === PropertyGraphModes.NONE
        ? ["auto","auto"]
        : [ props.min ?? "auto", props.max ?? "auto" ]

    return <div className="relative">
        <ResponsiveContainer
            width={"100%"}
            height={graph.height}
        >
            <LineChart
                data={data}
                margin={{ left: 50 }}
                syncId={"someId"}
            >

                {content.data?.weatherRange.map(d => <Line
                    key={d.source.slug}
                    type="monotone"
                    dataKey={d.source.slug}
                    unit={" " + property.unit ?? ""}
                    dot={false}
                    stroke={d.source.stroke}
                    activeDot={true}
                />)}

                <CartesianGrid />

                <XAxis
                    dataKey="time"
                    tickFormatter={name => {
                        return format(new Date(name), "H")
                    }}
                    minTickGap={20}
                />

                <YAxis 
                    unit={property.unit} 
                    domain={domain as any}
                />

                <Tooltip
                    formatter={(value: number, name, props) => {
                        return [value.toFixed(3), Sources.one(name).name];
                    }}
                    labelFormatter={(value) => {
                        return format(new Date(value), "d. M. Y H:mm");
                    }}
                />

            </LineChart>

        </ResponsiveContainer>

        {content.loading && <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <Spinner size="lg" color="default"/>
        </div>}
    </div>
}