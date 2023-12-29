"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useScopeContext } from "../scopeContext";
import { ScopeHeaderMenuItem } from "./scopeHeaderMenuItem";

export const ScopeHeader: React.FC = () => {

    const context = useScopeContext();

    const router = useRouter();

    const items = useMemo(() => context.availableScopes.map(s => ({
        key: s.slug,
        label: s.name
    })), [context.availableScopes]);

    return <div className="gap-1 flex">

        <div>

            <Button
                onClick={() => {
                    // context.dispatch( ScopeActionsFactory.removeActiveScope() );
                    router.push("/")
                }}
                isIconOnly
                color="default"
                variant="shadow"
                className="bg-foreground text-background bg-opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </Button>

        </div>

        <div>

            <Dropdown>
                <DropdownTrigger>
                    <Button color="default" variant="shadow" className="bg-foreground text-background">
                        {context.activeScope && context.activeScope.name}
                        {context.isLoading && <Spinner size="sm" color="default" />}
                        {context.availableScopes.length > 0 &&
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    items={items}
                >
                    {(item) => <DropdownItem href={`/${item.key}`} key={item.key}>{item.label}</DropdownItem>}
                </DropdownMenu>
            </Dropdown>

        </div>

        <ScopeHeaderMenuItem href={`/${context.activeScope?.slug}`}>
            Grafy
        </ScopeHeaderMenuItem>
        
        <ScopeHeaderMenuItem href={`/${context.activeScope?.slug}/info`}>
            Info
        </ScopeHeaderMenuItem>

    </div>
}