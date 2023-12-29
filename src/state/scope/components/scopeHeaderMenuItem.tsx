"use client";

import { Button, cn } from "@nextui-org/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react";

type ScopeHeaderMenuItemProps = React.PropsWithChildren & {

    href: string,
    tooltip?: React.ReactNode

}

export const ScopeHeaderMenuItem: React.FC<ScopeHeaderMenuItemProps> = props => {

    const router = useRouter();

    const pathname = usePathname();

    const isActive = useMemo( () => {
        return pathname === props.href 
    }, [ pathname, props.href ] );

    const classes = cn(
        "bg-foreground text-background",
        !isActive && "bg-opacity-50"
    );

    return <div>
        <Button
            onClick={() => router.push( props.href )}
            color="default"
            variant="shadow"
            className={classes}

        >
            {props.children}
        </Button>
    </div>

}