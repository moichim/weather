"use client";

import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting";
import { ThermalRangeSlider } from "@/thermal/components/controls/ThermalRangeSlider";
import { PaletteControl } from "@/thermal/components/controls/paletteControl";
import { OpacityScale } from "@/thermal/components/registry/OpacityScale";
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useMemo } from "react";
import { ThermalInstanceDisplayParameters, ThermalInstanceNew } from "../../thermalInstanceNew";
import { SingleInstanceDownloadButtons } from "./singleInstanceDownloadButtons";

type SingleInstanceDetailProps = ThermalInstanceDisplayParameters & {
    instance: ThermalFileInstance,
    hasDownloadButtons?: boolean,
    purpose?: string
}

export const SingleInstanceDetail: React.FC<SingleInstanceDetailProps> = ({

    instance,
    hasDownloadButtons = true,
    purpose = undefined,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    const ID = useMemo(() => {
        if (purpose) return purpose;
        return `single_instance_detail___${instance.id}`;
    }, []);

    const { value: minmax } = useThermalRegistryMinmaxState(instance.group.registry, ID);

    const loading = instance.group.registry.loading.value;

    return <>

        <div className="pb-6">
            <div className="w-full">
                <ThermalRangeSlider
                    registry={instance.group.registry}
                    histogramBorder={false}
                />
            </div>
            <div className="w-full flex flex-wrap items-center">
                <div className="w-2/3">
                    <OpacityScale registry={instance.group.registry} />
                </div>
                <div className="w-1/3">
                    <PaletteControl registry={instance.group.registry} />
                </div>
            </div>
        </div>

        <ThermalInstanceNew

            instance={instance}

            // This instance should have full length allways
            className="w-full"

            hasPopup={hasPopup}
            showDateOnHighlight={showDateOnHighlight}
            highlightColor={highlightColor}
            highlightOnHover={highlightOnHover}
            forceHighlight={forceHighlight}

        />

        <div className="pt-6">

            <Table
                aria-label="Shrnutí vlastností termogramu"
                removeWrapper
                hideHeader
                fullWidth
                isCompact
            >
                <TableHeader>
                    <TableColumn>Vlastnost</TableColumn>
                    <TableColumn>Hodnota</TableColumn>
                </TableHeader>

                <TableBody
                    isLoading={loading || minmax === undefined}
                >

                    <TableRow key="time">
                        <TableCell>Čas snímku</TableCell>
                        <TableCell>{TimeFormat.human(instance.timestamp)}</TableCell>
                    </TableRow>


                    <TableRow key="min">
                        <TableCell>Minimum</TableCell>
                        <TableCell>
                            {minmax !== undefined
                                ? <>{minmax.min.toFixed(4)} °C</>
                                : "načítám"
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow key="max">
                        <TableCell>Maximum</TableCell>
                        <TableCell>
                            {minmax !== undefined
                                ? <>{minmax.max.toFixed(4)} °C</>
                                : "načítám"
                            }
                        </TableCell>
                    </TableRow>

                    <TableRow key="resolution">
                        <TableCell>Rozlišení</TableCell>
                        <TableCell>{instance.width} x {instance.height} px</TableCell>
                    </TableRow>

                    <TableRow key="signature">
                        <TableCell>Signatura</TableCell>
                        <TableCell>{instance.signature}</TableCell>
                    </TableRow>

                </TableBody>

            </Table>

        </div>

        {hasDownloadButtons && <SingleInstanceDownloadButtons
            thermalUrl={instance.url}
            visibleUrl={instance.visibleUrl}
        />}
    </>

}