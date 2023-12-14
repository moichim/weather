"use client";

import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { useGraphInstanceMeteo } from "../useGraphinstanceMeteo";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export const GraphStatistics: React.FC<GraphInstanceState> = props => {

    const { data, selection, isLoading } = useGraphInstanceMeteo(props.property.slug);

    if (!data || isLoading) return <></>

    if (!data.statistics) return <></>

    return <Table 
        hideHeader 
        aria-label="Statistiky"
    >
        <TableHeader>
            <TableColumn>Vlastnost</TableColumn>
            <TableColumn>Průměrná hodnota</TableColumn>
            <TableColumn>Maximální hodnota</TableColumn>
            <TableColumn>Minimální hodnota</TableColumn>
        </TableHeader>
        <TableBody>
        {data && Object.entries(data.statistics).filter(([key, statistic]) => statistic.count > 0).map(([key, statistic]) => {
            const property = statistic.type === "line"
                ? data.lines.find(line => line.slug === key)!
                : data.dots.find(dot => dot.slug === key)!;
            return <TableRow style={{ color: property.color }} key={key}>
                <TableCell>{property.name}</TableCell>
                <TableCell>{statistic.avg.toFixed(3)}</TableCell>
                <TableCell>{statistic.min.toFixed(3)}</TableCell>
                <TableCell>{statistic.max.toFixed(3)}</TableCell>
            </TableRow>
        })}
    </TableBody>
    </Table>

}