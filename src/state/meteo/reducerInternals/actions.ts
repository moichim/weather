export enum DataActions {

    SET_SCOPE = 1,
    SET_FILTER_STRING = 2,
    SET_FILTER_TIMESTAMP = 3,
    SET_RANGE_TIMESTAMP = 4,
    REMOVE_RANGE = 5,

    START_SELECTING_RANGE = 6,
    END_SELECTING_RANGE = 7

}

interface DataActionBase {
    type: DataActions,
    payload: any
}

export type DataPayloadBase = {
    [index:string]: any
}

export interface DataAction< P extends DataPayloadBase > extends DataActionBase {
    payload: P
}



export type SetScopePayload = DataPayloadBase & {
    scope: string
}

export interface SetScopeAction extends DataAction<SetScopePayload> {
    type: DataActions.SET_SCOPE
}






export interface SetFilterSringPayload extends DataPayloadBase {
    from: string,
    to: string
}

export interface SetFilterStringAction extends DataAction<SetFilterSringPayload> {
    type: DataActions.SET_FILTER_STRING
}





export interface SetFilterTimestampPayload extends DataPayloadBase {
    from: number,
    to: number
}

export interface SetFilterTimestampAction extends DataAction<SetFilterTimestampPayload> {
    type: DataActions.SET_FILTER_TIMESTAMP
}






export interface SetRangeTimestampPayload extends DataPayloadBase {
    from: number,
    to: number
}

export interface SetRangeTimestampAction extends DataAction<SetRangeTimestampPayload> {
    type: DataActions.SET_RANGE_TIMESTAMP
}






export interface RemoveRangePayload extends DataPayloadBase {
    do: boolean
}

export interface RemoveRangeAction extends DataAction<RemoveRangePayload> {
    type: DataActions.REMOVE_RANGE
}





export interface StartSelectingRangePayload extends DataPayloadBase {
    timestamp: number
}

export interface StartSelectingRangeAction extends DataAction<StartSelectingRangePayload> {
    type: DataActions.START_SELECTING_RANGE
}




export interface EndSelectingRangePayload extends DataPayloadBase {
    timestamp: number
}

export interface EndSelectingRangeAction extends DataAction<EndSelectingRangePayload> {
    type: DataActions.END_SELECTING_RANGE
}







export class DataActionsFactory {

    public static setScope( scope: string ): SetScopeAction {
        return {
            type: DataActions.SET_SCOPE,
            payload: {
                scope: scope
            }
        }
    }

    public static setFilterString(
        from: string,
        to: string
    ): SetFilterStringAction {
        return {
            type: DataActions.SET_FILTER_STRING,
            payload: {
                from,
                to
            }
        }
    }

    public static setFilterTimestamp(
        from: number,
        to: number
    ): SetFilterTimestampAction {
        return {
            type: DataActions.SET_FILTER_TIMESTAMP,
            payload: {
                from,
                to
            }
        }
    }

    public static setRangeTimestamp(
        from: number,
        to: number
    ): SetRangeTimestampAction {
        return {
            type: DataActions.SET_RANGE_TIMESTAMP,
            payload: {
                from,
                to
            }
        }
    }

    public static removeRange(): RemoveRangeAction {
        return {
            type: DataActions.REMOVE_RANGE,
            payload: {
                do: true
            }
        }
    }


    public static startSelectingRange( timestamp: number ): StartSelectingRangeAction {
        return {
            type: DataActions.START_SELECTING_RANGE,
            payload: {
                timestamp
            }
        }
    }


    public static endSelectingRange( timestamp: number ): EndSelectingRangeAction {
        return {
            type: DataActions.END_SELECTING_RANGE,
            payload: {
                timestamp
            }
        }
    }

}