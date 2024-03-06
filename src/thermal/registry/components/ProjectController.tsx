"use client";

import { ThermalGroup } from "./ThermalGroup";
import { useProjectLoader } from "../context/useProjectLoader";
import { useRegistryListener } from "../context/useRegistryListener";
import { ThermalScale } from "./registry/ThermalScale";
import { useEffect, useState } from "react";
import { SliderValue } from "@nextui-org/slider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { OpacityScale } from "./registry/OpacityScale";

type ProjectControllerProps = {
    scope: string
}

export const ProjectController: React.FC<ProjectControllerProps> = props => {

    const { groups, loading } = useProjectLoader(props.scope);

    const listener = useRegistryListener();

    const onSliderChange = (value: SliderValue) => {
        if (Array.isArray(value)) {
            listener.setRange({ from: value[0], to: value[1] });
        }
    }

    return <div className="min-w-screen min-h-screen dark" style={{ backgroundColor: "#222" }}>

        <Navbar className="z-50 text-foreground"
            maxWidth="full"
            height="10rem"
            isBordered={true}
        >
            <NavbarBrand className="">
                <div>
                    <p className="font-bold">Analýza časosběrného měření</p>
                    <p>Hromadné vyhodnocení termogramů.</p>
                </div>
            </NavbarBrand>
            <NavbarContent className="gap-4" justify="center" style={{ minWidth: "50%" }}>

                {(listener.minmax !== undefined && listener.range !== undefined) &&
                    <ThermalScale
                        step={ Math.round((listener.minmax.max - listener.minmax.min ) / 50 ) }
                        min={listener.minmax.min}
                        max={listener.minmax.max}
                        from={listener.range.from}
                        to={listener.range.to}
                        onChange={onSliderChange}
                    />
                }
            </NavbarContent>
            <NavbarContent justify="end">
                <OpacityScale />
            </NavbarContent>
        </Navbar>


        { loading === true &&

            <div className="text-center text-white py-40" style={{padding: "10rem 0rem"}}>
                <Spinner />
                <p>Načítám</p>
            </div>
        
        }


        <div className="flex flex-wrap">
            {Object.entries(groups).map(([groupId, definition]) => {
                return <>
                    <ThermalGroup
                        groupId={groupId}
                        name={definition.name}
                        description={definition.description}
                        files={definition.files}
                    />
                </>
            })}
        </div>
    </div>

}