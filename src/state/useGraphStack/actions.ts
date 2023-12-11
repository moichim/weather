import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties"
import { GraphDomain, GraphInstanceScales } from "./storage"
import { GraphTools } from "./tools"

export enum GraphActions {
    
    ADD_GRAPH = 1,
    REMOVE_GRAPH = 2,
    SET_SHARED_SCALE = 3,
    RESET_ALL = 4,
    
    SET_INSTANCE_HEIGHT = 5,
    SET_INSTANCE_PROPERTY = 6,
    SET_INSTANCE_DOMAIN = 7,
    
    SELECT_TOOL = 8,

    SELECTION_START = 9,
    SELECTION_END = 10,
    SELECTION_REMOVE = 11,

}

export interface GraphStateActionBase {
    type: GraphActions,
    payload: any
}

type GraphStateActionPayload = {}

interface GraphStackAction< P extends GraphStateActionPayload > extends GraphStateActionBase {
    payload: P
}




export type AddGraphPayload = {
    property: AvailableWeatherProperties
}

export type AddGraphAction = GraphStackAction<AddGraphPayload> & {
    type: GraphActions.ADD_GRAPH
}




export type RemoveGraphPayload = {
    property: AvailableWeatherProperties
}

export type RemoveGraphAction = GraphStackAction<RemoveGraphPayload> & {
    type: GraphActions.REMOVE_GRAPH
}




export type SetSharedScalePayload = {
    scale: GraphInstanceScales
}

export type SetSharedScaleAction = GraphStackAction<SetSharedScalePayload> & {
    type: GraphActions.SET_SHARED_SCALE
}




export type ResetAllAction = GraphStateActionPayload & {
    type: GraphActions.RESET_ALL,
    payload: true
}




export type SetInstanceHeightPayload = {
    property: AvailableWeatherProperties,
    scale: GraphInstanceScales
}

export type SetInstanceHeightAction = GraphStackAction<SetInstanceHeightPayload> & {
    type: GraphActions.SET_INSTANCE_HEIGHT
}




export type SetInstanceDomainPayload = {
    property: AvailableWeatherProperties,
    domain: GraphDomain,
    range?: {min:number,max:number}
}

export type SetInstanceDomainAction = GraphStackAction<SetInstanceDomainPayload> & {
    type: GraphActions.SET_INSTANCE_DOMAIN
}





export type SetInstancePropertyPayload = {
    fromProperty: AvailableWeatherProperties,
    toProperty: AvailableWeatherProperties
}

export type SetInstancePropertyction = GraphStackAction<SetInstancePropertyPayload> & {
    type: GraphActions.SET_INSTANCE_PROPERTY
}





export type SetGraphToolPayload = {
    tool: GraphTools
}

export type SetGraphToolAction = GraphStackAction<SetGraphToolPayload> & {
    type: GraphActions.SELECT_TOOL
}




export type SelectionModificationPayload = {
    property: AvailableWeatherProperties,
    timestamp: number
}

export type SelectionStartAction = GraphStackAction<SelectionModificationPayload> & {
    type: GraphActions.SELECTION_START
}

export type SelectionEndAction = GraphStackAction<SelectionModificationPayload> & {
    type: GraphActions.SELECTION_END
}

export type SelectionRemovePayload = boolean;

export type SelectionRemoveAction = GraphStackAction<SelectionRemovePayload> & {
    type: GraphActions.SELECTION_REMOVE
}





/** GraphStack actions factory */
export class StackActions {

    public static addGraph(
        property: AvailableWeatherProperties
    ): AddGraphAction {
        return {
            type: GraphActions.ADD_GRAPH,
            payload: {
                property: property
            }
        }
    }

    public static removeGraph(
        property: AvailableWeatherProperties
    ): RemoveGraphAction
    {
        return {
            type: GraphActions.REMOVE_GRAPH,
            payload: {
                property: property
            }
        }
    }

    public static setSharedScale(
        scale: GraphInstanceScales
    ): SetSharedScaleAction {
        return {
            type: GraphActions.SET_SHARED_SCALE,
            payload: {
                scale: scale
            }
        }
    }

    public static resetAll(): ResetAllAction {
        return {
            type: GraphActions.RESET_ALL,
            payload: true
        }
    }

    public static setInstanceHeight(
        property: AvailableWeatherProperties,
        scale: GraphInstanceScales
    ): SetInstanceHeightAction {
        return {
            type: GraphActions.SET_INSTANCE_HEIGHT,
            payload: {
                property,
                scale
            }
        }
    }


    public static setInstanceDomain(
        property: AvailableWeatherProperties,
        domain: GraphDomain
    ): SetInstanceDomainAction {
        return {
            type: GraphActions.SET_INSTANCE_DOMAIN,
            payload: {
                property,
                domain
            }
        }
    }

    public static setInstanceProperty(
        fromProperty: AvailableWeatherProperties,
        toProperty: AvailableWeatherProperties
    ): SetInstancePropertyction {
        return {
            type: GraphActions.SET_INSTANCE_PROPERTY,
            payload: {
                fromProperty,
                toProperty
            }
        }
    }


    public static selectTool(
        tool: GraphTools
    ): SetGraphToolAction {
        return {
            type: GraphActions.SELECT_TOOL,
            payload: {
                tool
            }
        }
    }

    public static selectionStart(
        property: AvailableWeatherProperties,
        timestamp: number
    ): SelectionStartAction {
        return {
            type: GraphActions.SELECTION_START,
            payload: {
                property,
                timestamp
            }
        }
    }


    public static selectionEnd(
        property: AvailableWeatherProperties,
        timestamp: number
    ): SelectionEndAction {
        return {
            type: GraphActions.SELECTION_END,
            payload: {
                property,
                timestamp
            }
        }
    }

    public static selectionRemove(): SelectionRemoveAction {
        return {
            type: GraphActions.SELECTION_REMOVE,
            payload: true
        }
    }


}