import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource";
import { ThermalStorageNew } from "./storage";

export const createInstanceFromSource = (
    state: ThermalStorageNew,
    source: ThermalFileSource,
    targetGroupId: string
) => {

    if ( state.groups[ targetGroupId ] ) {

        const eventualExistinginstance = Object.values( state.groups[ targetGroupId ].instancesByUrl )

        if ( state.groups[ targetGroupId ].instancesByUrl() ) 

    }

}