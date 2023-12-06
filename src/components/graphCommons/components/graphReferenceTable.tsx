import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { PropertyGraphWithStateType } from "../useGraph";

export const GraphReferenceTable: React.FC<PropertyGraphWithStateType> = props => {

    // if ( props.isSelecting ) return <></>

    // if ( props.display.isSelecting === false ) return <></>
    if (props.display.reference === undefined) return <></>

    return <Table hideHeader cellPadding={2}>
        <TableHeader>
            <TableColumn>Hodnota</TableColumn>
            <TableColumn>Průměr</TableColumn>
            <TableColumn>Minimum</TableColumn>
            <TableColumn>Maximum</TableColumn>
        </TableHeader>
        <TableBody>

            {props.tableData.map(row => <TableRow key={row.name} style={{ color: row.color }} aria-labelledby={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline text-gray-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
</svg>

                    {row.average?.toFixed(2)}
                </TableCell>
                <TableCell>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 inline text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                    </svg>
                    {row.min?.toFixed(2)}
                </TableCell>
                <TableCell>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 inline text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                    {row.max?.toFixed(2)}
                </TableCell>
            </TableRow>)}

        </TableBody>
    </Table>

}