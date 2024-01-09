"use client";

import { GoogleScope } from "@/graphql/google/google";
import { useScopeContext } from "../scopeContext";
import {useEffect} from "react";
import { ScopeActionsFactory } from "../reducerInternals/actions";

type ScopePageWrapperProps = React.PropsWithChildren & {
    scope: GoogleScope
}

export const ScopePageWrapper: React.FC<ScopePageWrapperProps> = props => {

    const { activeScope, dispatch } = useScopeContext();

    useEffect(() => {

        if ( activeScope === undefined ) {
            dispatch( ScopeActionsFactory.setActiveScope( props.scope ) );
        } else if ( activeScope.slug !== props.scope.slug ) {
            dispatch( ScopeActionsFactory.setActiveScope( props.scope ) );
        }

    },[activeScope]);

    return <>{props.children}</>

}