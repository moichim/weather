import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryNew } from "../../useThermalRegistryNew"
import { ThermalInstanceDisplayParameters } from "../thermalInstanceNew";
import { useEffect, useMemo } from "react";
import { useThermalManagerContext } from "../../../thermalManagerContext";
import { SingleDisplay } from "../displays/singleDisplay";

type SingleDisplayProps = ThermalInstanceDisplayParameters & {
    thermalUrl: string
    visibleUrl?: string,
    registryId?: string,
    hasDownloadButtons?: boolean
}

export const SingleController: React.FC<SingleDisplayProps> = ({
    thermalUrl,
    visibleUrl = undefined,
    registryId = undefined,

    hasDownloadButtons = false,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    // Calculate the ID once for all (until the thermalUrl changes)
    const ID = useMemo(() => {

        if (registryId) {
            return registryId;
        }

        return `single_${thermalUrl}_${(Math.random() * 100).toFixed(0)}`;

    }, [thermalUrl]);

    const registry = useThermalRegistryNew(ID);
    const manager = useThermalManagerContext();

    // Load the file everytime the URLs change
    useEffect(() => {

        registry.loadOneFile({
            thermalUrl: thermalUrl,
            visibleUrl: visibleUrl
        }, ID);

    }, []);


    // Remove the registry on unmount
    useEffect(() => {
        return () => manager.removeRegistry(ID);
    }, []);



    return <SingleDisplay
    
        registry={registry}
        hasDownloadButtons={hasDownloadButtons}

        hasPopup={hasPopup}
        showDateOnHighlight={showDateOnHighlight}
        highlightColor={highlightColor}
        highlightOnHover={highlightOnHover}
        forceHighlight={forceHighlight}

    />

}