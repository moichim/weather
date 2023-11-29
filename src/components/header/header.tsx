"use client";

import { Sources } from "@/graphql/weatherSources/source";
import { Button, ButtonGroup, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { SourceButton } from "./sourceButton";
import { useFilterContext } from "@/state/filterContext";
import { format } from "date-fns";
import { DateDropdown } from "./dateDropdown";

const sources = Sources.all();

const days = ["01","02","03","04","05","06","07"];
const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const years = ["2023","2024"];

export const Header: React.FC = () => {

    return <Navbar shouldHideOnScroll>
        <NavbarBrand>
            <p className="font-bold text-inherit">Meteostanice</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
                Časové rozmezí
            </NavbarItem>
            <NavbarItem isActive>
            </NavbarItem>
            <NavbarItem>
                <Input type="to" label="Do" size="sm" />
            </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
                Zdroje
            </NavbarItem>
            <NavbarItem>
                <ButtonGroup>

                    {sources.map(s => <SourceButton {...s} key={s.name}/>)}

                </ButtonGroup>
            </NavbarItem>
        </NavbarContent>
    </Navbar>
}