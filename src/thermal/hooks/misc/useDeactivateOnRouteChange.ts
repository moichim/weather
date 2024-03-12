"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { ThermalGroup } from "@/thermal/registry/ThermalGroup";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useDeactivateOnRouteChange = (
    target: undefined|ThermalGroup|ThermalFileInstance
) => {

    const pathname = usePathname();
    const initialPathname = useMemo( () => pathname, [] );

    useEffect( () => {

        if ( pathname !== initialPathname ) {
            target?.recieveActivationStatus( false );
        }

    }, [pathname, target] );

    return {
        target
    }

}