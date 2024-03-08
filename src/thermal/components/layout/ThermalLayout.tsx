"use client";

import { RegistryContextProvider } from "@/thermal/context/RegistryContext"
import { ThermalHeader } from "./ThermalHeader"

export const ThermalLayout: React.FC<React.PropsWithChildren> = props => {
    return <div className="min-w-screen min-h-screen dark" style={{ backgroundColor: "#222" }}>

        <RegistryContextProvider>

            <ThermalHeader />

            {props.children}

        </RegistryContextProvider>

    </div>
}