import ThermalFile from "@/utils/reader/thermalFile"

export enum ThermalActions {

    ADD_FILE = 1,
    REMOVE_FILE = 2,

}

// BASE

export type ThermalPayloadBase = {}

type ThermalActionBase<P extends ThermalPayloadBase = AvailableThermalActions> = {
    type: ThermalActions,
    payload: P
}



// LOAD FILE

type AddFilePayload = ThermalPayloadBase & {
    file: ThermalFile
}

type AddFileAction = ThermalActionBase<AddFilePayload> & {
    type: ThermalActions.ADD_FILE
}


// REMOVE FILE

type RemoveFilePayload = ThermalPayloadBase & {
    id: string
}

type RemoveFileAction = ThermalActionBase<RemoveFilePayload> & {
    type: ThermalActions.REMOVE_FILE
}

export type AvailableThermalActions = RemoveFileAction | AddFileAction;



export default class ThermalActionsFactory {

    public static addFile(
        file: ThermalFile
    ): AddFileAction {
        return {
            type: ThermalActions.ADD_FILE,
            payload: {
                file: file
            }
        }
    }

    public static removeFile(
        id: string
    ): RemoveFileAction {
        return {
            type: ThermalActions.REMOVE_FILE,
            payload: {
                id: id
            }
        }
    }

}