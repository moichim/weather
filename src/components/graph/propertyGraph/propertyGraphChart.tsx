"use client";

import { Sources } from "@/graphql/weatherSources/source";
import { useDisplayContext } from "@/state/displayContext";
import { prepareGraphData, useWeatherContext } from "@/state/weatherContext";
import { Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PropertyGraphModes, PropertyGraphWithStateType } from "./propertyGraph";

export const PropertyGraphChart: React.FC<PropertyGraphWithStateType> = props => {
    const content = useWeatherContext();

    const { grid: graph } = useDisplayContext();

    const cnt = useMemo(()=> prepareGraphData( props.prop, content.data ?? {weatherRange: []} ), [ props.prop, content.data ]);


    const domain = props.domain === PropertyGraphModes.NONE
        ? ["auto","auto"]
        : [ props.min ?? "auto", props.max ?? "auto" ]

    return <div className="relative">
        <ResponsiveContainer
            width={"100%"}
            height={graph.height}
        >
            <LineChart
                data={cnt.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
            >

                <CartesianGrid />

                {cnt.lines.map( src => {

                    return <Line 
                        key={src.slug}
                        dataKey={src.slug}
                        unit={cnt.property.unit ?? ""}
                        dot={false}
                        stroke={src.stroke}
                    />
                    
                } ) }

                <XAxis
                    dataKey="time"
                    tickFormatter={name => {
                        return format(new Date(name), "H")
                    }}
                    // minTickGap={20}
                />

                <YAxis 
                    unit={cnt.property.unit} 
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