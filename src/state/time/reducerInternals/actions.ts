import { GoogleScope } from "@/graphql/google/google";
import { TimeStoragePresetType } from "./storage";
import { SelectionStartAction } from "@/state/graph/reducerInternals/actions";

export enum TimeEvents {
    INIT_FROM_SCOPE = 1,
    RESET = 7,
    
    SET_RANGE = 2,

    SET_SELECTION = 9,
    START_SELECTING = 3,
    END_SELECTING = 4,
    CLEAR_SELECTION = 8,
    
    ADD_PRESET = 5,
    ACTIVATE_PRESET = 6,

}

export enum RoundTo {
    HOUR = 1,
    DAY = 2,
    WEEK = 3,
    MONTH = 4
}

type TimePayloadBase = {};
type TimeEventBase<T extends TimePayloadBase> = {
    type: TimeEvents,
    payload: T
}

// init from scope

export type InitFromScopePayload = TimePayloadBase & {
    scope: GoogleScope
}

type InitFromScopeAction = TimeEventBase<InitFromScopePayload> & {
    type: TimeEvents.INIT_FROM_SCOPE
}

const initFromScope = (
    scope: GoogleScope
): InitFromScopeAction => {
    return {
        type: TimeEvents.INIT_FROM_SCOPE,
        payload: {
            scope
        }
    }
}


// Reset

type ResetAction = TimeEventBase<TimePayloadBase> & {
    type: TimeEvents.RESET
}

const reset = (): ResetAction => {
    return {
        type: TimeEvents.RESET,
        payload: {}
    }
}


// Add preset

export type AddPresetPayload = TimePayloadBase & TimeStoragePresetType & {
    slug: string
}

type AddPresetAction = TimeEventBase<AddPresetPayload> & {
    type: TimeEvents.ADD_PRESET
}

const addPreset = (
    slug: string,
    name: string,
    from: number,
    to: number
): AddPresetAction => {
    return {
        type: TimeEvents.ADD_PRESET,
        payload: {
            name,
            slug,
            from,
            to,
            active: false
        }
    }
}


// Activate preset

export type ActivatePresetType = TimePayloadBase & {
    presetSlug: string
}

type ActivatePresetAction = TimeEventBase<ActivatePresetType> & {
    type: TimeEvents.ACTIVATE_PRESET
}

const activatePreset = ( presetSlug: string ): ActivatePresetAction => {
    return {
        type: TimeEvents.ACTIVATE_PRESET,
        payload: {
            presetSlug
        }
    }
}


// Selection


export type SlectionPayload = TimePayloadBase & {
    value: number,
    roundTo: RoundTo
}

// Start selection

type StartSelectionAction = TimeEventBase<SlectionPayload> & {
    type: TimeEvents.START_SELECTING
}

const startSelection = (
    value: number,
    roundTo: RoundTo
): StartSelectionAction => {
    return {
        type: TimeEvents.START_SELECTING,
        payload: {
            value,
            roundTo
        }
    }
}

// End selection

type EndSelectionAction = TimeEventBase<SlectionPayload> & {
    type: TimeEvents.END_SELECTING
}

const endSelection = (
    value: number,
    roundTo: RoundTo
): EndSelectionAction => {
    return {
        type: TimeEvents.END_SELECTING,
        payload: {
            value,
            roundTo
        }
    }
}


// Clear selection

type ClearSelectionAction = TimeEventBase<TimePayloadBase> & {
    type: TimeEvents.CLEAR_SELECTION
}

const clearSelection = (): ClearSelectionAction => {
    return {
        type: TimeEvents.CLEAR_SELECTION,
        payload: {}
    }
}


// Seting


export type SetPayload = TimePayloadBase & {
    from: number,
    to: number,
    roundTo: RoundTo
}

// Set selection

type SetSelectionAction = TimeEventBase<SetPayload> & {
    type: TimeEvents.SET_SELECTION
}

const setSelection = (
    from: number,
    to: number,
    roundTo: RoundTo
): SetSelectionAction => {
    return {
        type: TimeEvents.SET_SELECTION,
        payload: {
            from,
            to,
            roundTo
        }
    }
}


// Set selection

type SetRangeAction = TimeEventBase<SetPayload> & {
    type: TimeEvents.SET_RANGE
}

const setRange = (
    from: number,
    to: number,
    roundTo: RoundTo
): SetRangeAction => {
    return {
        type: TimeEvents.SET_RANGE,
        payload: {
            from,
            to,
            roundTo
        }
    }
}


/** Dispatch time events from the data */
export class TimeEventsFactory {

    public static initFromScope = initFromScope;
    public static reset = reset;

    public static addPreset = addPreset;
    public static activatePreset = activatePreset;

    public static startSelection = startSelection;
    public static endSelection = endSelection;
    public static clearSelection = clearSelection;

    public static setSelection = setSelection;
    public static setRange = setRange;

}


/** All available time actions */
export type TimeEventsType = InitFromScopeAction
    | ResetAction
    | AddPresetAction
    | ActivatePresetAction
    | SelectionStartAction
    | EndSelectionAction
    | ClearSelectionAction
    | SetSelectionAction
    | SetRangeAction;