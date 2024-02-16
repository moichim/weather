import {ThermalFileSource} from "@/thermal/reader/ThermalFileSource"
import ThermalFile from "@/thermal/reader/thermalFile"

export enum ThermalActionsNew {
    
    INIT_GROUP = 1,
    REMOVE_GROUP = 2,

    SET_GLOBAL_RANGE = 3,

    LOADING_START = 4,
    LOADING_PENDING = 5,
    LOADING_SUCCESS = 6,
    LOADING_ERROR = 7,
    REMOVE_FILE_IN_GROUP = 8,

    SET_GROUP_RANGE = 9,
    SET_GROUP_BYPASS = 10,
    SET_GROUP_CURSOR = 11

}

type RangeSetterType = { from: number, to: number } | { from: undefined, to: undefined }
type CursorSetterType = { x: number, y: number } | { x: undefined, y: undefined }

// Base payloads
type ThermalPayloadBase = {}
type ThermalGlobalPayloadBase = ThermalPayloadBase & {
}
type ThermalGroupPayloadBase = ThermalPayloadBase & {
    groupId: string,
}

// Base actions
type ThermalActionBase<P extends ThermalPayloadBase> = {
    type: ThermalActionsNew,
    payload: P
}
type ThermalGlobalActionBase<P extends ThermalGlobalPayloadBase> = ThermalActionBase<P>
type ThermalGroupActionBase<P extends ThermalGroupPayloadBase> = ThermalActionBase<P>


// Set global range
type GlobalSetRangePayload = ThermalGlobalPayloadBase 
& RangeSetterType;
type GlobalSetRangeAction = ThermalGlobalActionBase<GlobalSetRangePayload> & { type: ThermalActionsNew.SET_GLOBAL_RANGE }

// Initialise a group
type GroupInitPayload = ThermalGlobalPayloadBase & {
    groupId?: string
};
type GroupInitAction = ThermalGlobalActionBase<GroupInitPayload> & { type: ThermalActionsNew.INIT_GROUP };

// Remove a group
type GroupRemovePayload = ThermalGroupPayloadBase & { groupId: string };
type GroupRemoveAction = ThermalGroupActionBase<GroupRemovePayload> & { type: ThermalActionsNew.REMOVE_GROUP }

// Set  group range
type GroupSetRangePayload = ThermalGroupPayloadBase &  RangeSetterType;
type GroupSetRangeAction = ThermalGroupActionBase<GroupSetRangePayload> & { type: ThermalActionsNew.SET_GROUP_RANGE }

// Set group bypass
type GroupSetBypassPayload = ThermalGroupPayloadBase & { bypass: boolean }
type GroupSetBypassAction = ThermalGroupActionBase<GroupSetBypassPayload> & {type: ThermalActionsNew.SET_GROUP_BYPASS}

// Set group cursor
type GroupSetCursorPayload =  ThermalGroupPayloadBase & CursorSetterType;
type GroupSetCursorAction = ThermalGroupActionBase<GroupSetCursorPayload> &{type:ThermalActionsNew.SET_GROUP_CURSOR}

// Start loading a file
type GroupLoadFilePayload = ThermalGroupPayloadBase & { url: string }
type GroupLoadFileAction = ThermalGroupActionBase<GroupLoadFilePayload> & { type: ThermalActionsNew.LOADING_START }

// Set the file pending
type GroupStartLoadingFilePayload = ThermalGlobalPayloadBase & { url: string }
type GroupStartLoadingFileAction = ThermalGlobalActionBase<GroupStartLoadingFilePayload> & { type: ThermalActionsNew.LOADING_PENDING }

// Set file loaded
type GlobalSetFileLoadedPayload = ThermalGlobalPayloadBase & { url: string, file: ThermalFileSource }
type GlobalSetFileLoadedAction = ThermalGlobalActionBase<GlobalSetFileLoadedPayload> & { type: ThermalActionsNew.LOADING_SUCCESS }

// Set file error
type GlobalSetFileErrorPayload = ThermalGlobalPayloadBase & { url: string }
type GlobalSetFileErrorAction = ThermalGlobalActionBase<GlobalSetFileErrorPayload> & { type: ThermalActionsNew.LOADING_ERROR }

export class ThermalActionsNewFactory {

    public static globalSetRange( value: RangeSetterType ): GlobalSetRangeAction {
        return {
            type: ThermalActionsNew.SET_GLOBAL_RANGE,
            payload: value
        }
    }

    public static grouplInit(
        groupId?: string
    ):GroupInitAction {
        return {
            type: ThermalActionsNew.INIT_GROUP,
            payload: {
                groupId: groupId
            }
        }
    }

    public static groupRemove(
        groupId: string
    ): GroupRemoveAction {
        return {
            type: ThermalActionsNew.REMOVE_GROUP,
            payload: {
                groupId: groupId
            }
        }
    }

    public static groupSetRange( 
        groupId: string,
        value: RangeSetterType 
    ): GroupSetRangeAction {
        return {
            type: ThermalActionsNew.SET_GROUP_RANGE,
            payload: {
                groupId: groupId,
                ...value
            }
        }
    }

    public static groupSetBypass(
        groupId: string,
        value: boolean
    ): GroupSetBypassAction {
        return {
            type: ThermalActionsNew.SET_GROUP_BYPASS,
            payload: {
                groupId: groupId,
                bypass: value
            }
        }
    }

    public static groupSetCursor(
        groupId: string,
        cursorValue: CursorSetterType
    ): GroupSetCursorAction {
        return {
            type: ThermalActionsNew.SET_GROUP_CURSOR,
            payload: {
                groupId: groupId,
                ...cursorValue
            }
        }
    }

    public static groupLoadFile(
        groupId: string,
        url: string
    ): GroupLoadFileAction {
        return {
            type: ThermalActionsNew.LOADING_START,
            payload: {
                groupId: groupId,
                url: url
            }
        }
    }

    public static globalLoadFileSetPending(
        url: string,
        // groupId: string
    ): GroupStartLoadingFileAction {
        return {
            type: ThermalActionsNew.LOADING_PENDING,
            payload: {
                // groupId: groupId,
                url: url,
            }
        }
    }

    public static globalLoadFileSuccess(
        url: string,
        file: ThermalFileSource
    ): GlobalSetFileLoadedAction {
        return {
            type: ThermalActionsNew.LOADING_SUCCESS,
            payload: {
                url: url,
                file: file
            }
        }
    }

    public static globalLoadFileError(
        url: string
    ): GlobalSetFileErrorAction {
        return {
            type: ThermalActionsNew.LOADING_ERROR,
            payload: {
                url: url
            }
        }
    }

}


export type AvailableThermalActions = GroupInitAction | GlobalSetRangeAction | GlobalSetRangeAction | GroupSetBypassAction | GroupSetCursorAction | GroupSetRangeAction | GroupLoadFileAction | GlobalSetFileLoadedAction | GlobalSetFileLoadedAction | GroupStartLoadingFileAction;
