"use client";

import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting"
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance"
import { useMemo } from "react"
import { MinmaxTable } from "../../dataViews/minmaxTable"
import { ThermalInstanceDisplayParameters, ThermalInstanceNew } from "../../thermalInstanceNew"
import { SingleInstanceDownloadButtons } from "./singleInstanceDownloadButtons"
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";

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

    const { value: minmax } = useThermalRegistryMinmaxState( instance.group.registry, ID );

    return <>
        <div className="">
            <MinmaxTable
                minmax={minmax}
                loading={ instance.group.registry.loading.value }
                hideHeader={true}
                removeWrapper={true}
                fullWidth={true}
            />

            <div>
                <div>Čas snímku: {TimeFormat.human(instance.timestamp)}</div>
                <div>Rozlišení snímku: {instance.width} x {instance.height} px</div>
                <div>Název souboru: {instance.url}</div>
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

        {hasDownloadButtons && <SingleInstanceDownloadButtons
            thermalUrl={instance.url}
            visibleUrl={instance.visibleUrl}
        />}
    </>

}