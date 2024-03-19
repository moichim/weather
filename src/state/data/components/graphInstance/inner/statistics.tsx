"use client";

import { InfoIcon } from "@/components/ui/icons";
import { GoogleColumnStats } from "@/graphql/google/google"
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, cn } from "@nextui-org/react";

type StatisticsProps = {
    data?: GoogleColumnStats[],
    label: React.ReactNode,
    loading: boolean
}

export const Statistics: React.FC<StatisticsProps> = props => {

    console.log("statistika", props.data);

    if (props.data === undefined || props.loading === true) {
        return <div className="bg-white rounded-xl w-full min-h-40 flex items-center justify-center">
            <Spinner />
        </div>
    } else return <Table
        isCompact
        shadow="none"
    >
        <TableHeader>
            <TableColumn>Zdroj</TableColumn>
            <TableColumn>AVG</TableColumn>
            <TableColumn>MIN</TableColumn>
            <TableColumn>MAX</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data.map(row =>
                <TableRow
                    style={{ color: row.color }}
                >
                    <TableCell>
                        <Tooltip
                            content={row.description}
                            placement="left"
                            color="foreground"
                            showArrow
                            className="max-w-40"
                            isDisabled={row.description === null}
                        >
                                <span className={cn( 
                                    "flex gap-2",
                                    row.description !== null && "cursor-help"
                                )}>
                                    {row.name}
                                    {row.description !== null && <InfoIcon />}
                                </span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>{row.avg?.toFixed(2)}</TableCell>
                    <TableCell>{row.min?.toFixed(2)}</TableCell>
                    <TableCell>{row.max?.toFixed(2)}</TableCell>
                </TableRow>
            )}

        </TableBody>
    </Table>

}