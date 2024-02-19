import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource"

export enum RehookActions {
    INIT_GROUP = 0,
    START_LOADING = 1,
    FINISH_LOADING = 2,
    AFTER_LOADED = 3,
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
    type: RehookActions,
    payload: P
}
type ThermalGlobalActionBase<P extends ThermalGlobalPayloadBase> = ThermalActionBase<P>
type ThermalGroupActionBase<P extends ThermalGroupPayloadBase> = ThermalActionBase<P>



// Initialise a group
type GroupInitPayload = ThermalGlobalPayloadBase & {
    groupId?: string
};
type GroupInitAction = ThermalGlobalActionBase<GroupInitPayload> & { type: RehookActions.INIT_GROUP };

/*
// Remove a group
type GroupRemovePayload = ThermalGroupPayloadBase & { groupId: string };
type GroupRemoveAction = ThermalGroupActionBase<GroupRemovePayload> & { type: RehookActions.REMOVE_GROUP }

// Set  group range
type GroupSetRangePayload = ThermalGroupPayloadBase &  RangeSetterType;
type GroupSetRangeAction = ThermalGroupActionBase<GroupSetRangePayload> & { type: RehookActions.SET_GROUP_RANGE }

// Set group bypass
type GroupSetBypassPayload = ThermalGroupPayloadBase & { bypass: boolean }
type GroupSetBypassAction = ThermalGroupActionBase<GroupSetBypassPayload> & {type: RehookActions.SET_GROUP_BYPASS}

// Set group cursor
type GroupSetCursorPayload =  ThermalGroupPayloadBase & CursorSetterType;
type GroupSetCursorAction = ThermalGroupActionBase<GroupSetCursorPayload> &{type:RehookActions.SET_GROUP_CURSOR}

*/

// Start loading a file
type GroupLoadFilePayload = ThermalGroupPayloadBase & { url: string }
type GroupLoadFileAction = ThermalGroupActionBase<GroupLoadFilePayload> & { type: RehookActions.START_LOADING }

// Set the file pending
type GlobalFileLoadedPayload = ThermalGlobalPayloadBase & { file: ThermalFileSource }
type GlobalFileLoadedAction = ThermalGlobalActionBase<GlobalFileLoadedPayload> & { type: RehookActions.FINISH_LOADING }

// Set file loaded
type GlobalAfterImageLoadedPayload = ThermalGlobalPayloadBase & { url: string }
type GlobalAfterFileLoadedAction = ThermalGlobalActionBase<GlobalAfterImageLoadedPayload> & { type: RehookActions.AFTER_LOADED }


// Set file error
/*
type GlobalSetFileErrorPayload = ThermalGlobalPayloadBase & { url: string }
type GlobalSetFileErrorAction = ThermalGlobalActionBase<GlobalSetFileErrorPayload> & { type: ThermalActionsNew.LOADING_ERROR }
*/

export class ThermoActionsFactory {

    /*
    public static globalSetRange( value: RangeSetterType ): GlobalSetRangeAction {
        return {
            type: RehookActions.SET_GLOBAL_RANGE,
            payload: value
        }
    }
    */

    public static grouplInit(
        groupId?: string
    ): GroupInitAction {
        return {
            type: RehookActions.INIT_GROUP,
            payload: {
                groupId: groupId
            }
        }
    }

    /*
    public static groupRemove(
        groupId: string
    ): GroupRemoveAction {
        return {
            type: RehookActions.REMOVE_GROUP,
            payload: {
                groupId: groupId
            }
        }
    }
    */

    /*
    public static groupSetRange( 
        groupId: string,
        value: RangeSetterType 
    ): GroupSetRangeAction {
        return {
            type: RehookActions.SET_GROUP_RANGE,
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
            type: RehookActions.SET_GROUP_BYPASS,
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
            type: RehookActions.SET_GROUP_CURSOR,
            payload: {
                groupId: groupId,
                ...cursorValue
            }
        }
    }
    */

    public static groupLoadFile(
        groupId: string,
        url: string
    ): GroupLoadFileAction {
        return {
            type: RehookActions.START_LOADING,
            payload: {
                groupId: groupId,
                url: url
            }
        }
    }

    public static globalFileLoaded(
        file: ThermalFileSource,
        // groupId: string
    ): GlobalFileLoadedAction {
        return {
            type: RehookActions.FINISH_LOADING,
            payload: {
                file: file
            }
        }
    }


}


export type AvailableThermoActions = GroupInitAction
    // | GlobalSetRangeAction
    // | GlobalSetRangeAction
    // | GroupSetBypassAction
    // | GroupSetCursorAction
    // | GroupSetRangeAction
    | GroupLoadFileAction
    | GlobalAfterFileLoadedAction
    | GlobalAfterFileLoadedAction
    | GlobalFileLoadedAction;