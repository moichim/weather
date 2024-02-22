"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useThermoContext } from "../context/thermoContext";
import { CursorSetterType, RangeSetterType, ThermoActionsFactory } from "../context/reducerInternals/actions";

export const useThermoGroupObserver = ( groupId: string ) => {

    // The ID is immutable.
    const id = useMemo( () => groupId, [] );

    const {
        state: globalState,
        dispatch,
    } = useThermoContext();


    const setCursor = useCallback( ( cursor: CursorSetterType ) => {
        dispatch( ThermoActionsFactory.groupSetCursor( id, cursor ) );
    }, [dispatch, id] );

    const setRange = useCallback( (
        range: RangeSetterType
    ) => {
        dispatch( ThermoActionsFactory.groupSetRange( id, range ) );
    }, [dispatch, id] );

    const state = useMemo( () => {
        return globalState.groups[ id ];
    }, [ globalState.groups, id ] );

    return {
        state,
        setCursor,
        setRange
    }

}