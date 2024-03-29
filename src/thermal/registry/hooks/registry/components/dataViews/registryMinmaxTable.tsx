import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, TableProps} from "@nextui-org/react";
import { useMemo } from "react";

type RegistryMinmaxTableProps = TableProps & {
    registry: ThermalRegistry,
    decimals?: number
}

export const RegistryMinmaxTable: React.FC<RegistryMinmaxTableProps> = ({
    registry,
    decimals = 3,
    ...props
}) => {

    const purpose = useMemo( () => {

        return `minmax_table__${registry.id}__${ (Math.random() * 100).toFixed(0) }`;

    }, [] );

    const minmax = useThermalRegistryMinmaxState( registry, purpose );
    const loading = useThermalRegistryLoadingState( registry, purpose );

    return <Table
        aria-label="Tabulka minima a maxima"
        {...props}
    >
        <TableHeader>
            <TableColumn>Vlastnost</TableColumn>
            <TableColumn>Hodnota ve stupních Celsia</TableColumn>
        </TableHeader>

        <TableBody
            isLoading={ loading.value || minmax.value === undefined }
        >
            <TableRow key="min">
                <TableCell>Minimum</TableCell>
                <TableCell>
                    {minmax.value !== undefined
                        ? <>{minmax.value.min.toFixed(decimals)} °C</>
                        : "načítám"
                    }
                </TableCell>
            </TableRow>
            <TableRow key="min">
                <TableCell>Maximum</TableCell>
                <TableCell>
                    {minmax.value !== undefined
                        ? <>{minmax.value.max.toFixed(decimals)} °C</>
                        : "načítám"
                    }
                </TableCell>
            </TableRow>
        </TableBody>

    </Table>
}