import ThermalFile from "@/thermal/reader/thermalFile"

export enum ThermalActions {

    ADD_FILE = 1,
    REMOVE_FILE_BY_ID = 2,

    SET_RANGE = 3

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

type RemoveFilyByIdPayload = ThermalPayloadBase & {
    id: string
}

type RemoveFileByIdAction = ThermalActionBase<RemoveFilyByIdPayload> & {
    type: ThermalActions.REMOVE_FILE_BY_ID
}


// EXPORT ALL

type SetRangePayload = ThermalPayloadBase & {
    from: number,
    to: number
}

type SetRangeAction = ThermalActionBase<SetRangePayload> & {
    type: ThermalActions.SET_RANGE
}


// All

export type AvailableThermalActions = RemoveFileByIdAction | AddFileAction | SetRangeAction;



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

    public static removeFileById(
        id: string
    ): RemoveFileByIdAction {
        return {
            type: ThermalActions.REMOVE_FILE_BY_ID,
            payload: {
                id: id
            }
        }
    }

    public static setRange(
        from: number,
        to: number
    ): SetRangeAction {
        return {
            type: ThermalActions.SET_RANGE,
            payload: {
                from,
                to
            }
        }
    }

}