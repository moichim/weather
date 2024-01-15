"use client";

import { GoogleScope } from "@/graphql/google/google";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, cn, getKeyValue } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "../ui/icons";

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
        school: <div className="flex w-full items-center gap-4">
            <div className="group-hover:translate-x-1 text-gray-500 group-hover:text-primary-500 transform-all duration-200 ease-in-out group-hover:scale-[1.2]">
                <ArrowRightIcon />
            </div>
            <strong className="group-hover:text-primary-500">{item.name}</strong>
        </div>,
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
                className="group cursor-pointer"
            >
                {( key ) => <TableCell className={ ["team","description"].includes( key.toString() ) ? "hidden lg:table-cell" : "" }>
                    {getKeyValue(row, key)}
                </TableCell>}
            </TableRow>}
        </TableBody>
    </Table>

}