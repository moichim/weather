"use client";

import { RegistryContextProvider } from "@/thermal/context/RegistryContext"
import { ThermalHeader } from "./ThermalHeader"

export const ThermalLayout: React.FC<React.PropsWithChildren> = props => {
    return <div className="min-w-screen min-h-screen">

            <ThermalHeader />

            {props.children}

    </div>
}