import { ThermalGroup } from "@/thermal/registry/ThermalGroup"
import { useThermalGroupInstancesState } from "@/thermal/registry/properties/lists/instances/useThermalGroupInstancesState"
import { useThermalGroupMinmaxProperty } from "@/thermal/registry/properties/states/minmax/group/useThermalGroupMinmaxState"
import { ThermalInstanceNew } from "./thermalInstanceNew"

type ThermalGroupPanelProps = {
    group: ThermalGroup
}

export const ThermalGroupPanel: React.FC<ThermalGroupPanelProps> = props => {

    const minmax = useThermalGroupMinmaxProperty( props.group, "panel display" );

    const instances = useThermalGroupInstancesState( props.group, "panel display" );

    return <div>

        {instances.value.map( instance => <ThermalInstanceNew 
            instance={instance}
            key={instance.id}
        /> )}

    </div>

}