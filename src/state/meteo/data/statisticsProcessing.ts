import { ViewInstanceStatisticsType } from "@/components/graphs/utils/useGraphInstancData";
import { WeatherStatistic, WeatherStatistics } from "@/graphql/weather/weather";
import { WeatherProperty } from "@/graphql/weather/definitions/properties";
import { Sources } from "@/graphql/weather/definitions/source";
import { MeteoQueryResponseType } from "./query";

export type GraphStatisticsDataType = {
    lines: {
        [index: string]: WeatherStatistics
    },
    dots: {
        [index: string]: WeatherStatistic
    }
}

export class StatisticsProcessing {

    public static extractAllFromQuery(
        response: MeteoQueryResponseType
    ): GraphStatisticsDataType {

        const propertyStatistics = Object.fromEntries(response.weatherRange.map(source => {
            const statistics = source.statistics;
            return [source.source.slug, statistics]
        }));

        const googleStatistics = Object.fromEntries(response.range.data.map(column => {
            const stats = {
                name: column.name,
                color: column.color,
                slug: column.slug,
                in: column.in.slug,
                min: column.min ?? undefined,
                max: column.max ?? undefined,
                avg: column.avg ?? undefined,
                count: column.count,
                type: "dot" as "line" | "dot"
            } as WeatherStatistic
            return [column.slug, stats];
        }));

        return {
            lines: propertyStatistics,
            dots: googleStatistics
        }

    }

    public static extractForOneProperty(
        statistics: GraphStatisticsDataType,
        property: WeatherProperty
    ): ViewInstanceStatisticsType {

        const lineStatistics = Object.fromEntries(
            Object.entries(statistics.lines)
                .filter(([sourceSlug, properties]) => {
                    return property.in.includes(sourceSlug);
                })
                .map(([sourceSlug, properties]) => {
                    const source = Sources.one(sourceSlug);
                    const statistics = {
                        ...properties[property.slug],
                        name: source.name,
                        slug: source.stroke,
                        color: source.color
                    } as WeatherStatistic
                    return [sourceSlug, statistics]
                })
        );

        const dotStatistics = Object.fromEntries(
            Object.entries(statistics.dots)
                .filter(([columnSlug, column]) => {
                    return column.in === property.slug && column.count > 0
                })
                .map(([columnSlug, column]) => {
                    return [columnSlug, {
                        min: column.min,
                        max: column.max,
                        avg: column.avg,
                        count: column.count,
                        slug: column.slug,
                        name: column.name,
                        color: column.color,
                        in: column.in
                    } as WeatherStatistic]
                })
        );

        return {
            ...lineStatistics,
            ...dotStatistics
        } as ViewInstanceStatisticsType

    }

}