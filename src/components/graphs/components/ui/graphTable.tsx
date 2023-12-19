"use client";

import { WeatherProperty } from "@/graphql/weather/definitions/properties";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { ViewInstanceStatisticsType, useGraphInstanceMeteo } from "../../utils/useGraphInstancData";

type GraphTablePropsType = {
    statisticsData: ViewInstanceStatisticsType,
    property: WeatherProperty
}

export const GraphTable: React.FC<GraphTablePropsType> = props => {

    const rows = useMemo(() => Object.values(props.statisticsData), [props.statisticsData, props.property.slug]);

    const { data } = useGraphInstanceMeteo(props.property.slug);

    const columns = useMemo(() => [
        { key: "name", label: "Zdroj dat" },
        { key: "avg", label: "Průměr" },
        { key: "min", label: "Minimum" },
        { key: "max", label: "Maximum" },
        // { key: "count", label: "Počet záznamů" },
    ], []);

    const formatOutputValue = useCallback((value?: number) => value && `${value.toFixed(2)} ${props.property.unit ?? ""}`, [props.property.unit])

    const tableRows = useMemo(() => rows.map(row => {

        return {
            key: row.slug,
            name: row.name,
            avg: formatOutputValue(row.avg),
            min: formatOutputValue(row.min),
            max: formatOutputValue(row.max),
            color: row.color,
            count: row.count
        }
    }), [formatOutputValue, rows]);

    if (rows.length === 0 || data === undefined) {
        return <></>;
    }

    return <>
        <Table
            aria-label={`Statistiky pro veličinu '${props.property.name}'`}
            removeWrapper
        >
            <TableHeader
                columns={columns}
            >
                {(column) => <TableColumn>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
                items={tableRows}
            >
                {(item) => (
                    <TableRow key={item.key} style={{ color: item.color }}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>


}