import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource"

export enum ThermoActions {
    INIT_GROUP = 0,
    REGISTER_LOADED_FILE = 1,
    INSTANTIATE_SOURCE_IN_GROUP = 2,
    INSTANTIATE_SOURCE_IN_MULTIPLE_GROUPS = 3,

    GROUP_SET_CURSOR = 4,
    GROUP_SET_RANGE = 5,
    GLOBAL_SET_RANGE = 6,

    GROUP_AFTER_EVERYTHING_LOADED = 7,

    GLOBAL_SET_IR_ASPECT = 8
}

export type RangeSetterType = { from: number, to: number } | { from: undefined, to: undefined }
export type CursorSetterType = { x: number, y: number } | { x: undefined, y: undefined }


// Base payloads
type ThermalPayloadBase = {}
type ThermalGlobalPayloadBase = ThermalPayloadBase & {
}
type ThermalGroupPayloadBase = ThermalPayloadBase & {
    groupId: string,
}

// Base actions
type ThermalActionBase<P extends ThermalPayloadBase> = {
    type: ThermoActions,
    payload: P
}
type ThermalGlobalActionBase<P extends ThermalGlobalPayloadBase> = ThermalActionBase<P>
type ThermalGroupActionBase<P extends ThermalGroupPayloadBase> = ThermalActionBase<P>



// Initialise a group
type GroupInitPayload = ThermalGlobalPayloadBase & {
    groupId?: string
};
type GroupInitAction = ThermalGlobalActionBase<GroupInitPayload> & { type: ThermoActions.INIT_GROUP };



// Clone a source into a group

type GroupInstantiateFilePayload = ThermalGroupPayloadBase & { url: string }
type GroupInstantiateFileAction = ThermalGroupActionBase<GroupInstantiateFilePayload> & { type: ThermoActions.INSTANTIATE_SOURCE_IN_GROUP }

// Clone a source into multiple groups

type GlobalInstantiateSourceToGroupsPayload = ThermalGlobalPayloadBase & { url: string, groups: string[] }
type GlobalInstantiateSourceToGroupsAction = ThermalGlobalActionBase<GlobalInstantiateSourceToGroupsPayload> & { type: ThermoActions.INSTANTIATE_SOURCE_IN_MULTIPLE_GROUPS }


// Register a file and instantiate it to all groups

type GlobalRegisterSourcePayload = ThermalGlobalPayloadBase & {
    file: ThermalFileSource,
    groups: string[]
}
type GlobalRegisterSourceAction = ThermalGlobalActionBase<GlobalRegisterSourcePayload> & {
    type: ThermoActions.REGISTER_LOADED_FILE
}


type GroupSetCursorPayload = ThermalGroupPayloadBase & {
    cursor: CursorSetterType
}
type GroupSetCursorAction = ThermalGroupActionBase<GroupSetCursorPayload> & {
    type: ThermoActions.GROUP_SET_CURSOR
}


type GroupSetRangePayload = ThermalGroupPayloadBase & {
    range: RangeSetterType
}
type GroupSetRangeAction = ThermalGroupActionBase<GroupSetRangePayload> & {
    type: ThermoActions.GROUP_SET_RANGE
}


type GlobalSetRangePayload = ThermalGlobalPayloadBase & {
    range: RangeSetterType
}
type GlobalSetRangeAction = ThermalGlobalActionBase<GlobalSetRangePayload> & {
    type: ThermoActions.GLOBAL_SET_RANGE
}


type GroupAfterEverythingLoadedPayload = ThermalGroupPayloadBase & {}
type GroupAfterEverythingLoadedAction = ThermalGlobalActionBase<GroupAfterEverythingLoadedPayload> & {
    type: ThermoActions.GROUP_AFTER_EVERYTHING_LOADED
}


type GlobalSetIrAspectPayload = ThermalGlobalPayloadBase & {
    irAspect: number
}
type GlobalSetIrAspectAction = ThermalGlobalActionBase<GlobalSetIrAspectPayload> & {
    type: ThermoActions.GLOBAL_SET_IR_ASPECT
}

export class ThermoActionsFactory {


    public static grouplInit(
        groupId?: string
    ): GroupInitAction {
        return {
            type: ThermoActions.INIT_GROUP,
            payload: {
                groupId: groupId
            }
        }
    }

    public static instantiateFile(
        url: string,
        groupId: string
    ): GroupInstantiateFileAction {
        return {
            type: ThermoActions.INSTANTIATE_SOURCE_IN_GROUP,
            payload: {
                groupId: groupId,
                url: url
            }
        }
    }

    public static instantiateSourceToGroups(
        url: string,
        groups: string[]
    ): GlobalInstantiateSourceToGroupsAction {
        return {
            type: ThermoActions.INSTANTIATE_SOURCE_IN_MULTIPLE_GROUPS,
            payload: {
                groups: groups,
                url: url
            }
        }
    }


    public static registerLoadedSource(
        file: ThermalFileSource,
        groups: string[]
    ): GlobalRegisterSourceAction {
        return {
            type: ThermoActions.REGISTER_LOADED_FILE,
            payload: {
                file: file,
                groups: groups
            }
        }
    }

    public static groupSetCursor(
        groupId: string,
        cursor: CursorSetterType
    ): GroupSetCursorAction {
        return {
            type: ThermoActions.GROUP_SET_CURSOR,
            payload: {
                groupId,
                cursor
            }
        }
    }

    public static groupSetRange(
        groupId: string,
        range: RangeSetterType
    ): GroupSetRangeAction {
        return {
            type: ThermoActions.GROUP_SET_RANGE,
            payload: {
                groupId,
                range
            }
        }
    }

    public static globalSetRange(
        range: RangeSetterType
    ): GlobalSetRangeAction {
        return {
            type: ThermoActions.GLOBAL_SET_RANGE,
            payload: {
                range
            }
        }
    }

    public static groupAfterLoad(
        groupId: string
    ): GroupAfterEverythingLoadedAction {
        return {
            type: ThermoActions.GROUP_AFTER_EVERYTHING_LOADED,
            payload: {
                groupId
            }
        }
    }

    public static setIrAspect(
        irAspect: number
    ): GlobalSetIrAspectAction {
        return {
            type: ThermoActions.GLOBAL_SET_IR_ASPECT,
            payload: {
                irAspect: irAspect
            }
        }
    }


}


export type AvailableThermoActions = GroupInitAction
    | GroupInstantiateFileAction
    | GlobalRegisterSourceAction
    | GlobalInstantiateSourceToGroupsAction
    | GroupSetCursorAction
    | GroupSetRangeAction
    | GlobalSetRangeAction
    | GroupAfterEverythingLoadedAction
    | GlobalSetIrAspectAction;