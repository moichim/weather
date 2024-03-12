"use client"

import { Navbar, NavbarBrand, NavbarContent, SliderValue } from "@nextui-org/react"
import { ThermalAbout } from "../info/ThermalAbout"
import { OpacityScale } from "../registry/OpacityScale"
import { ThermalScale } from "../registry/ThermalScale"
import { useRegistryListener } from "@/thermal/context/useRegistryListener"
import { useProjectLoader } from "@/thermal/context/useProjectLoader"
import { ThermalScaleGlobal } from "../registry/ThermalScaleGlobal"
import { ThermalRange } from "../controls/ThermalRange"

export const ThermalHeader: React.FC = () => {

    const listener = useRegistryListener();

    const onSliderChange = (value: SliderValue) => {
        if (Array.isArray(value)) {
            listener.setRange({ from: value[0], to: value[1] });
        }
    }

    return <Navbar className="z-50 text-foreground"
        maxWidth="full"
        height="10rem"
        isBordered={true}
    >
        <NavbarBrand className="gap-4">
            <div>
                <p className="font-bold">Analýza časosběrného měření</p>
                <p>Hromadné vyhodnocení termogramů.</p>
            </div>
            <ThermalAbout />
        </NavbarBrand>
        <NavbarContent className="gap-4" justify="center" style={{ minWidth: "50%" }}>

            {listener.registry.range !== undefined && <ThermalRange object={listener.registry} imposeInitialRange={listener.registry.range} description="Klikněte na posuvník a změňte rozsah zobrazených teplot!"/>}
        </NavbarContent>
        <NavbarContent justify="end">
            {listener.ready && <div className="text-center">
                <OpacityScale />
                <p className="text-small text-gray-600 pt-4">Přepínejte mezi IR snímkem a snímkem z běžné kamery.</p>
            </div>}
        </NavbarContent>
    </Navbar>
}