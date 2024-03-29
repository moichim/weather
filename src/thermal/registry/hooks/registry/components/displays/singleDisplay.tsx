import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry"
import { ThermalInstanceDisplayParameters } from "../thermalInstanceNew"
import { useThermalRegistryGroups } from "@/thermal/registry/properties/lists/groups/useThermalRegistryGroupsState"
import { useMemo } from "react"
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState"
import { Spinner } from "@nextui-org/react"
import { SingleInstanceDetail } from "./detail/singleInstanceDetail"

type SingleDisplayProps = ThermalInstanceDisplayParameters & {
    registry: ThermalRegistry,
    hasDownloadButtons?: boolean
}


export const SingleDisplay: React.FC<SingleDisplayProps> = ({
    registry,
    hasDownloadButtons = false,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    // Hold the display id once for all
    const ID = useMemo( () => {
        return registry.id
    }, [] );

    const groups = useThermalRegistryGroups( registry, ID );

    const loading = useThermalRegistryLoadingState( registry, ID );

    if ( loading.value === true ) {
        return <>
            <Spinner/> Načítám registr
        </>
    }

    return <>{

        groups.value.map( group => {

            group.instances.value.map( instance => {

                <SingleInstanceDetail 
                    key={instance.id} 
                    
                    instance={instance} 
                    
                    hasPopup={hasPopup}
                    showDateOnHighlight={showDateOnHighlight}
                    highlightColor={highlightColor}
                    highlightOnHover={highlightOnHover}
                    forceHighlight={forceHighlight}

                />

            } );

        } )

    }</>

}