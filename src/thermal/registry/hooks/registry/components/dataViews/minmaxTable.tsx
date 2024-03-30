"use client";

import { ThermalMinmaxOrUndefined } from "@/thermal/registry/interfaces";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableProps, TableRow } from "@nextui-org/react";

type MinmaxTable = TableProps & {
    minmax: ThermalMinmaxOrUndefined,
    loading: boolean,
    decimals?: number
}

export const MinmaxTable: React.FC<MinmaxTable> = ({
    minmax,
    loading,
    decimals = 3,
    ...props
}) => {


    return <Table
        aria-label="Tabulka minima a maxima"
        {...props}
    >
        <TableHeader>
            <TableColumn>Vlastnost</TableColumn>
            <TableColumn>Hodnota ve stupních Celsia</TableColumn>
        </TableHeader>

        <TableBody
            isLoading={loading || minmax === undefined}
        >
            <TableRow key="min">
                <TableCell>Minimum</TableCell>
                <TableCell>
                    {minmax !== undefined
                        ? <>{minmax.min.toFixed(decimals)} °C</>
                        : "načítám"
                    }
                </TableCell>
            </TableRow>
            <TableRow key="max">
                <TableCell>Maximum</TableCell>
                <TableCell>
                    {minmax !== undefined
                        ? <>{minmax.max.toFixed(decimals)} °C</>
                        : "načítám"
                    }
                </TableCell>
            </TableRow>
        </TableBody>

    </Table>
}