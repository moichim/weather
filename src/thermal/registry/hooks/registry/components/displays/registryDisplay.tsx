"use client";

import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { useThermalRegistryGroups } from "@/thermal/registry/properties/lists/groups/useThermalRegistryGroupsState"
import { ThermalGroupPanel } from "../thermalGroupPanel"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState"
import { Spinner } from "@nextui-org/react"
import { useEffect } from "react";

export type RegistryDisplayProps = {
    registry: ThermalRegistry
}

/**
 * A stupid registry collection display.
 * 
 * Does not remove the registry upon unmount. This important thing should be executed by the parent component.
 */
export const RegistryDisplay: React.FC<RegistryDisplayProps> = props => {

    const groups = useThermalRegistryGroups(props.registry, "display");

    /** @todo Perhaps this step should be moved down to the group */
    const loading = useThermalRegistryLoadingState(props.registry, "display");


    if (loading.value === true) {
        return <>
            <Spinner /> Registr se načítá
        </>
    }

    return <div className="flex flex-wrap w-full">

        {/** Zde by měla být teplotní škála a další vlastnosti */}

        {groups.value.map(group => <ThermalGroupPanel group={group} key={group.id} />)}

    </div>

}