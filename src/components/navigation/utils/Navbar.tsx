"use client";

import {
    NavbarBrand,
    NavbarContent,
    Navbar as NextuiNavbar,
    NavbarProps as NextuiNavbarProps,
    Tooltip,
    Link,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    cn
} from "@nextui-org/react";
import { NavbarLink, NavbarLinkDefinition } from "./NavbarLink";
import { NavbarDesktopLinks } from "./NnavbarDesktopLinks";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import { useState } from "react";

export type NavbarProps = NextuiNavbarProps & {
    brandContent?: React.ReactNode,
    links?: NavbarLinkDefinition[],
    content?: React.ReactElement,
    endContent?: React.ReactNode,
    closeLink?: string,
    closeLinkHint?: React.ReactNode
}

export const Navbar: React.FC<NavbarProps> = ({
    closeLink,
    closeLinkHint,
    content,
    links,
    brandContent,
    endContent,
    ...props
}) => {

    const [open, setOpen] = useState<boolean>(false);

    return <NextuiNavbar
        maxWidth="full"
        isBordered={true}
        {...props}
        className={cn(
            props.className,
            "data-[menu-open=true]:z-50"
        )}
        classNames={{
            menu: "z-50"
        }}
        isMenuOpen={open}
        onMenuOpenChange={setOpen}
    >

        {(links || content || endContent) && <NavbarContent
            justify="start"
            className="md:hidden flex-grow-0"
            style={{
                width: "5rem !important",
                flexGrow: "0"
            }}
        >
            <NavbarMenuToggle
                aria-label={open ? "Zavřít menu" : "Rozbalit nabídku"}
                className="flex-grow-0"
            />
        </NavbarContent>}

        {brandContent && <>
            <NavbarBrand
                className="flex-grow-0 flex gap-8"
            >
                {brandContent}
                <div className="text-gray-400 pr-4 hidden md:block">
                    <ArrowRightIcon />
                </div>
            </NavbarBrand>
        </>}


        {links &&
            <NavbarMenu>

                {links.map((item, index) => {
                    return <NavbarMenuItem key={`item-${item.text?.toString().substring(0, 5)}_${index}`}>
                        <NavbarLink 
                            {...item}
                            activeVariant={{
                                color: "primary"
                            }}
                            inactiveVariant={{
                                color: "foreground"
                            }}
                        ></NavbarLink>
                    </NavbarMenuItem>
                })}

            </NavbarMenu>
        }


        <NavbarContent
            justify="start"
            className="flex-grow"
        >

            {links && <NavbarDesktopLinks
                links={links}
            />}

            {content && content}

        </NavbarContent>

        {(endContent || closeLink) && <NavbarContent
            justify="end"
        >

            {endContent && endContent}

            {closeLink && <Tooltip
                isDisabled={closeLinkHint === undefined}
                content={closeLinkHint}
                size="sm"
                color="foreground"
                placement="left"
            >
                <Link href={closeLink} color="foreground" className="hover:text-primary transition-all duration-300 ease-in-out">
                    <CloseIcon />
                </Link>
            </Tooltip>}

        </NavbarContent>}

    </NextuiNavbar>

}