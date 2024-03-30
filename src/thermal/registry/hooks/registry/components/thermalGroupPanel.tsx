"use client";

import { ThermalGroup } from "@/thermal/registry/ThermalGroup"
import { useThermalGroupInstancesState } from "@/thermal/registry/properties/lists/instances/useThermalGroupInstancesState"
import { useThermalGroupMinmaxProperty } from "@/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState"
import { ThermalInstanceNew } from "./thermalInstanceNew"
import { MinmaxTable } from "./dataViews/minmaxTable";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";

type ThermalGroupPanelProps = {
    group: ThermalGroup
}

export const ThermalGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const instances = useThermalGroupInstancesState(props.group, "panel display wtf");

    const minmax = useThermalGroupMinmaxProperty( props.group, "panel display" );

    const loading = useThermalRegistryLoadingState( props.group.registry, "panel display" );

    return <div className="w-1/4">

        <div>{props.group.id}</div>
        <div>{instances.value.length}</div>

        <MinmaxTable 
            minmax={minmax.value}
            loading={loading.value}
            hideHeader
            // isStriped
            // removeWrapper
        />

        <div className="flex flex-wrap">

            {instances.value.map(instance => <ThermalInstanceNew
                instance={instance}
                key={instance.id}
                highlightColor="black"
                syncTimeHighlight={true}
                highlightOnHover={true}
                showDateOnHighlight={true}
                hasPopup={true}
            />)}

        </div>

    </div>

}

