"use client";

import { Sources } from "@/graphql/weatherSources/source";
import { Button, ButtonGroup, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { SourceButton } from "./sourceButton";

const sources = Sources.all();

export const Header: React.FC = () => {

    return <Navbar shouldHideOnScroll>
        <NavbarBrand>
            <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
                Časové rozmezí
            </NavbarItem>
            <NavbarItem isActive>
                <Input type="from" label="Od" size="sm" />
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