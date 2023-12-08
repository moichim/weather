import { Properties } from "@/graphql/weatherSources/properties";
import { Reducer } from "react";
import { AddGraphPayload, GraphActions, GraphStateActionBase, SetHeightsPayload, SetInstanceDomainPayload, SetInstanceHeightPayload, SetInstancePropertyPayload } from "./actions";
import { GraphDomain, GraphInstanceState, GraphStackState, GraphStateFactory } from "./storage";

export const useGraphStackReducer: Reducer<GraphStackState, GraphStateActionBase> = (state, action) => {


    const updatedInstances = (
        callback: ((instance: GraphInstanceState) => GraphInstanceState)
    ) => {
        return Object.fromEntries(Object.entries(state.graphs).map(([key, entry]) => {
            const newEntry = callback(entry);
            return [key, newEntry];
        }));
    }

    switch (action.type) {

        case GraphActions.ADD_GRAPH:

            const { property: propertyAdd }: AddGraphPayload = action.payload;

            return {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyAdd]: GraphStateFactory.defaultInstanceState(propertyAdd, state.scale)
                }
            }
        case GraphActions.REMOVE_GRAPH:

            const { property: propertyRemove }: AddGraphPayload = action.payload;

            return {
                ...state,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .filter(([key, graph]) => key !== propertyRemove))
            }


        case GraphActions.RESET_ALL:
            return GraphStateFactory.defaultState();


        case GraphActions.SET_HEIGHTS:
            const { scale: scaleSetAll }: SetHeightsPayload = action.payload;
            return {
                ...state,
                scale: scaleSetAll,
                graphs: updatedInstances(instance => {
                    return {
                        ...instance,
                        scale: scaleSetAll
                    }
                })
            }

        case GraphActions.SET_INSTANCE_DOMAIN:
            const { property: propertyDomain, domain, range }: SetInstanceDomainPayload = action.payload;

            return {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyDomain]: {
                        ...state.graphs[propertyDomain],
                        domain,
                        domainMin: range ? range.min : undefined,
                        domainMax: range ? range.max : undefined
                    }
                }
            }

        case GraphActions.SET_INSTANCE_HEIGHT:
            const { scale, property: propertyHeight }: SetInstanceHeightPayload = action.payload;

            return {
                ...state,
                graphs: {
                    ...state.graphs,
                    [propertyHeight]: {
                        ...state.graphs[propertyHeight],
                        scale: scale
                    }
                }
            }

        case GraphActions.SET_INSTANCE_PROPERTY:
            const { fromProperty, toProperty }: SetInstancePropertyPayload = action.payload;

            const newGraphs = Object.fromEntries(Object.entries(state.graphs)
            .map(([key, entry]) => {

                if (key !== fromProperty)
                    return [key, entry];

                const definition = Properties.one(toProperty);

                const newProperty = [toProperty, {
                    ...entry,
                    property: definition,
                    domainMin: entry.domain === GraphDomain.DEFAULT
                        ? definition.min : undefined,
                    domainMax: entry.domain === GraphDomain.DEFAULT
                        ? definition.max : undefined,
                }];

                return newProperty;

            }));

            const newAvailableProperties = Properties.all().filter( property => ! Object.keys(newGraphs).includes( property.slug ) )

            return {
                ...state,
                availableGraphs: newAvailableProperties,
                graphs: newGraphs
            }

        case GraphActions.SELECT_TOOL:
            return {
                ...state,
                activeTool: action.payload.tool
            }

        case GraphActions.SELECTION_START:
            return {
                ...state,
                isSelecting: true,
                selectionStart: action.payload.timestamp,
                selectionEnd: undefined,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .map(([key, entry]) => {

                        if (key === action.payload.property) {
                            return [
                                key,
                                {
                                    ...entry,
                                    isSelecting: true
                                }
                            ]
                        }

                        return [key, entry]
                    })
                )
            }

        case GraphActions.SELECTION_END:
            return {
                ...state,
                isSelecting: false,
                selectionEnd: action.payload.timestamp,
                graphs: Object.fromEntries(Object.entries(state.graphs)
                    .map(([key, entry]) => {

                        if (key === action.payload.property) {
                            return [
                                key,
                                {
                                    ...entry,
                                    isSelecting: false
                                }
                            ]
                        }

                        return [key, entry]
                    })
                )
            }

        case GraphActions.SELECTION_REMOVE:
            return {
                ...state,
                isSelecting: false,
                selectionStart: undefined,
                selectionEnd: undefined
            }


        default:
            return state;


    }

}