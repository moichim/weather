"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { useScopeContext } from "../scopeContext"
import { ScopeActions, ScopeActionsFactory } from "../reducerInternals/actions";
import { useMemo } from "react";

export const ScopeSelectDwopdown: React.FC = () => {

    const context = useScopeContext();

    const buttonLabel = context.isLoading
        ? <><Spinner color="default" size="sm" />Načítám projekty</>
        : context.availableScopes.length === 0
            ? "Nebyly nalezeny žádné aktivní projekty"
            : context.activeScope !== undefined
                ? <>{context.activeScope.name}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg></>
                : <>Zvolte projekt <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg></>

    const items = useMemo(() => context.availableScopes.map(scope => ({
        key: scope.slug,
        label: scope.name
    })), [context.availableScopes]);

    return <div>

        <Dropdown

        >
            <DropdownTrigger>
                <Button
                    variant="bordered"
                >
                    {buttonLabel}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Static Actions"
                items={items}
                onAction={slug => context.dispatch(ScopeActionsFactory.setScope(slug.toString()))}
            >
                {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
            </DropdownMenu>
        </Dropdown>

    </div>
}