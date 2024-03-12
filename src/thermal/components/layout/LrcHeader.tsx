"use client"

import { useRegistryListener } from "@/thermal/context/useRegistryListener"
import { NavbarContent } from "@nextui-org/react"
import { ThermalRange } from "../controls/ThermalRange"
import { OpacityScale } from "../registry/OpacityScale"

export const LrcHeader: React.FC = () => {

    const listener = useRegistryListener();

    return <div className="z-50 text-foreground flex flex-wrap p-4"
    >
        <div className="w-full lg:w-3/4">

            {listener.registry.range !== undefined && <div className="p-4 rounded-xl bg-white mr-4"><ThermalRange object={listener.registry} imposeInitialRange={listener.registry.range} description="Klikněte na posuvník a změňte rozsah zobrazených teplot!"/></div>}
        </div>
        <div className="w-full lg:w-1/4">
            {listener.ready && <div className="text-center p-4 bg-white rounded-xl">
                <OpacityScale />
                <p className="text-small text-gray-600 pt-4">Přepínejte mezi IR snímkem a snímkem z běžné kamery.</p>
            </div>}
        </div>
    </div>
}