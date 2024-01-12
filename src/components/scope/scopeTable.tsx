"use client";

import { GoogleScope } from "@/graphql/google/google";
import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { NextComponentType } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ScopeTableProps = {
    scopes: GoogleScope[]
}

export const ScopeTable: React.FC<ScopeTableProps> = props => {

    const router = useRouter();

    const columns = [
        { key: "school", label: "Škola" },
        { key: "locality", label: "Lokalita" },
        { key: "team", label: "Tým" },
        { key: "description", label: "Popiska" },
        { key: "link", label: "Akce" },
    ];

    const rows = props.scopes.map(item => ({
        slug: item.slug,
        school: <strong>{item.name}</strong>,
        locality: item.locality,
        description: item.description,
        team: item.team,
        link: <>
            <Button
                as={Link}
                href={`${item.slug}`}
                size="sm"
            >Zobrazit data</Button>
        </>
    }));

    return <Table
        // className="text-foreground"
        // removeWrapper
        isStriped
        onRowAction={key => router.push(`/${key}`)}
    >
        <TableHeader columns={columns}>
            {column => <TableColumn className={ ["team","description"].includes( column.key.toString() ) ? "hidden lg:table-cell" : "" }>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
            {row => <TableRow
                key={row.slug}
                className=""
            >
                {( key ) => <TableCell className={ ["team","description"].includes( key.toString() ) ? "hidden lg:table-cell" : "" }>
                    {getKeyValue(row, key)}
                </TableCell>}
            </TableRow>}
        </TableBody>
    </Table>

}