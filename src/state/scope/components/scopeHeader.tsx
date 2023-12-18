"use client";

import { usePathname, useRouter } from "next/navigation";
import { useScopeContext } from "../scopeContext"
import { ScopeActionsFactory } from "../reducerInternals/actions";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useMemo } from "react";

export const ScopeHeader: React.FC = () => {

    const path = usePathname().replace( "/","" );
    const navigation = useRouter();

    const {activeScope, dispatch, availableScopes} = useScopeContext();

    if ( activeScope === undefined ) {
        dispatch( ScopeActionsFactory.setScope( path ) );
    }

    const items = useMemo(() => availableScopes.map(scope => ({
        key: scope.slug,
        label: scope.name
    })), [availableScopes]);

    return <div className="fixed top-3 left-3 text-center bg-background shadow-lg rounded-xl p-3">

        <Button
            href="/"
        >
            Zpět
        </Button>

        <Dropdown>
            <DropdownTrigger>
                <Button>{activeScope!.name}</Button>
            </DropdownTrigger>
            <DropdownMenu 
                items={items}
            >
                {(item) => <DropdownItem href={`/${item.key}`} key={item.key}>{item.label}</DropdownItem> }
            </DropdownMenu>
        </Dropdown>

        {activeScope?.name}

    </div>
}