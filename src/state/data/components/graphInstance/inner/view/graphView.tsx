import { GraphInstanceProps } from "@/state/data/context/useDataContextInternal"
import { GraphDomain } from "@/state/graph/reducerInternals/storage"
import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting"
import { Spinner } from "@nextui-org/react"
import { format } from "date-fns"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type GraphViewProps = GraphInstanceProps & {
    height: number
}

export const GraphView: React.FC<GraphViewProps> = props => {

    if (props.graphData === undefined) {
        return <Spinner />
    }

    const domain = props.state.domain === GraphDomain.DEFAULT || props.state.domain === GraphDomain.MANUAL
        ? [props.state.domainMin ?? "auto", props.state.domainMax ?? "auto"]
        : ["auto", "auto"];


    const ticks = useMemo(() => {

        let durationInHours = props.graphData ? props.graphData.data.length : 0;

        let times = (durationInHours > 0 && props.graphData) ? Object.values(props.graphData.data)
            .map(entry => entry.time) : [];

        let formatter: ((value: any, index: number) => string) | undefined = name => {
            return format(new Date(name), "H");
        };

        if (durationInHours >= 26 && durationInHours < 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23 || hour === 11) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "H:mm");
            };
        }

        if (durationInHours >= 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "d.M.");
            };
        }

        return {
            times,
            formatter
        }

    }, [props.graphData]);


    return <div className="relative w-full">

        <ResponsiveContainer
            width="100%"
            height={props.height}
        >
            <LineChart
                data={props.graphData.data}
                margin={{ left: 50 }}
                syncId={"syncId"}
            // style={{cursor: }}

            >

                <CartesianGrid strokeDasharray={"2 2"} />

                {props.graphData && props.graphData.lines.map(source => {

                    return <Line
                        key={source.slug}
                        dataKey={source.slug}
                        dot={false}
                        unit={" " + props.state.property.unit ?? ""}
                        stroke={source.stroke}
                        isAnimationActive={false}
                        name={source.name}
                    />

                })}

                {props.graphData && props.graphData.dots.map(dot => {
                    return <Line
                        key={dot.slug}
                        fill={dot.color}
                        stroke={dot.color}
                        dataKey={dot.slug}
                        isAnimationActive={false}
                        unit={dot.in.unit ?? ""}
                        connectNulls={true}
                        name={dot.name}
                    />
                })}

                <YAxis
                    unit={props.state.property.unit}
                    domain={domain as any}
                />

                <XAxis
                    dataKey="time"
                    tickFormatter={ticks.formatter}
                    ticks={ticks.times}
                />

            </LineChart>
        </ResponsiveContainer>

    </div>

}