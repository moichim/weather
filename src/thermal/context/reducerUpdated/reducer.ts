import { Reducer } from "react";
import { ThermalGroupType, ThermalImageLoadingState, ThermalStorageNew } from "./storage";
import { AvailableThermalActions, ThermalActionsNew } from "./actions";
import { current } from "tailwindcss/colors";
import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance";


const calculateMinMaxUponAdding = (
    
) => {

}


export const thermalReducerNew: Reducer<ThermalStorageNew, AvailableThermalActions> = (
    state,
    action
) => {

    switch (action.type) {

        case ThermalActionsNew.INIT_GROUP:

            const { groups: initGroupOldGroups, ...initGroupStateWithoutGroups } = state;

            const initGroupNewGroupId = action.payload.groupId
                ? action.payload.groupId
                : `group_${Object.values(initGroupOldGroups).length}`

            return {
                ...initGroupStateWithoutGroups,
                groups: {
                    ...state.groups,
                    [initGroupNewGroupId]: {
                        min: undefined,
                        max: undefined,
                        from: undefined,
                        to: undefined,
                        cursorX: undefined,
                        cursorY: undefined,
                        instancesByUrl: {},
                        requests: {}
                    } as ThermalGroupType
                }
            } as ThermalStorageNew;


        case ThermalActionsNew.SET_GLOBAL_RANGE:

            const {
                groups: globalSetRangeGroups,
                from: globalSetRangeFrom,
                to: globalSetRangeTo,
                ...globalSetRangeState
            } = state;

            Object.values(globalSetRangeGroups).forEach(group => {
                if (group.bypass === false) {
                    group.from = globalSetRangeFrom;
                    group.to = globalSetRangeTo;
                    if (globalSetRangeFrom && globalSetRangeTo) {
                        Object.values(group.instancesByUrl).forEach(file => {
                            file.from = globalSetRangeFrom;
                            file.to = globalSetRangeTo
                        });
                    }

                }
            });


            return {
                ...globalSetRangeState,
                from: action.payload.from,
                to: action.payload.to,
                groups: globalSetRangeGroups
            } as ThermalStorageNew


        case ThermalActionsNew.SET_GROUP_BYPASS:

            const {
                groups: groupSetBypassGroups,
                ...groupSetBypassState
            } = state;

            const groupSetBypassGroup = groupSetBypassGroups[action.payload.groupId];

            if (groupSetBypassGroup)
                groupSetBypassGroup.bypass = action.payload.bypass;

            return {
                ...groupSetBypassState,
                groups: groupSetBypassGroups
            } as ThermalStorageNew;


        case ThermalActionsNew.SET_GROUP_CURSOR:

            const {
                groups: groupSetCursorGroups,
                ...groupSetCursorState
            } = state;

            const groupSetCursorGroup = groupSetCursorGroups[action.payload.groupId];

            if (groupSetCursorGroup)
                groupSetCursorGroup.cursorX = action.payload.x;
            groupSetCursorGroup.cursorY = action.payload.y;

            return {
                ...groupSetCursorState,
                groups: groupSetCursorGroups
            } as ThermalStorageNew;


        case ThermalActionsNew.SET_GROUP_RANGE:

            const {
                groups: groupSetRangeGroups,
                ...groupSetRangeState
            } = state;

            const groupSetRangeGroup = groupSetRangeGroups[action.payload.groupId];

            if (groupSetRangeGroup)
                groupSetRangeGroup.from = action.payload.from;
            groupSetRangeGroup.to = action.payload.to;

            return {
                ...groupSetRangeState,
                groups: groupSetRangeGroups
            } as ThermalStorageNew;


        case ThermalActionsNew.LOADING_START:

            const {
                requestsFiredByUrl: {...loadingStartRequests},
                requestsPendingByUrl: {...loadStartPendingRequests},
                groups: {...loadingStartGroups},
                registryByUrl: {...loadingStartRegistry},
                ...loadingStartState
            } = state;

            // If the file is already in the registry, add its instance to the current group
            if (loadingStartRegistry[action.payload.url]) {

                const loadingStartExistingRegistryEntry = loadingStartRegistry[action.payload.url];

                // If the group is already amongst the source's instances, do nothing
                if (loadingStartExistingRegistryEntry.instancesByGroupId[action.payload.groupId]) {

                }
                // it the file is not amongst its instances, create a new instance
                else {

                    const newInstanceIndex = Object.keys(loadingStartGroups[action.payload.groupId]).length + 1;

                    const loadingStartNewInstance = ThermalFileInstance.fromSource( action.payload.groupId, `file_${newInstanceIndex}`, loadingStartExistingRegistryEntry.source );
                    
                    // loadingStartExistingRegistryEntry.source.createInstance(action.payload.groupId, `file_${newInstanceIndex}`);

                    // Add the instance to the registry
                    loadingStartExistingRegistryEntry.instancesByGroupId[action.payload.groupId] = loadingStartNewInstance;

                    // Add the instance to the group
                    loadingStartGroups[action.payload.groupId].instancesByUrl[loadingStartNewInstance.id] = loadingStartNewInstance;
                    loadingStartGroups[action.payload.groupId].min = 0;

                }

            }

            // If the file is already loading, add this group to the request's subscriptions
            else if (state.requestsPendingByUrl[action.payload.url]) {
                const loadingStartCurrentRequest = loadStartPendingRequests[action.payload.url];

                if (!loadingStartCurrentRequest.groups.includes(action.payload.groupId)) {
                    loadingStartCurrentRequest.groups.push(action.payload.groupId);
                }
            }

            // If the file is not loading yet, create new request
            else {

                loadingStartRequests[action.payload.url] = {
                    url: action.payload.url,
                    status: ThermalImageLoadingState.LOADING,
                    groups: [action.payload.groupId]
                }

            }


            return {
                requestsFiredByUrl: loadingStartRequests,
                requestsPendingByUrl: loadStartPendingRequests,
                registryByUrl: loadingStartRegistry,
                groups: loadingStartGroups,
                ...loadingStartState
            } as ThermalStorageNew

        case ThermalActionsNew.LOADING_PENDING:

            const {
                requestsFiredByUrl: {...loadingPendingFiredRequests},
                requestsPendingByUrl: {...loadingPendingRequests},
                ...loadingPendingState
            } = state;
                
                const currentlyPendingRequest = loadingPendingFiredRequests[ action.payload.url ];
                currentlyPendingRequest.status = ThermalImageLoadingState.PENDING;

                loadingPendingRequests[ action.payload.url ] = currentlyPendingRequest;

            // Finelly, remove the request from fired array

            const { [action.payload.url]:oldOne, ...newFiredRequests } = loadingPendingFiredRequests;


            return {
                requestsFiredByUrl: newFiredRequests,
                requestsPendingByUrl: loadingPendingRequests,
                ...loadingPendingState
            } as ThermalStorageNew



        case ThermalActionsNew.LOADING_SUCCESS:

            let {
                requestsPendingByUrl: { ...loadingSuccessRequests },
                registryByUrl: { ...loadingSuccessRegistry },
                groups: { ...loadingSuccessGroups },
                ...loadingSuccessState
            } = state;


            // Retrieve the current request
            const loadingSuccessCurrentRequest = loadingSuccessRequests[action.payload.url];

            // If there is the current request
            if (loadingSuccessCurrentRequest) {

                // get the existing source for the current request
                let existingSource = loadingSuccessRegistry[action.payload.url];

                // Create new source in the registry if not yet
                if (!existingSource) {

                    existingSource = {
                        url: action.payload.url,
                        source: action.payload.file,
                        instancesByGroupId: {}
                    };

                    // Create new registry entry
                    loadingSuccessRegistry[action.payload.url] = existingSource;

                }

                // Iterate all subscribed instance of the request
                loadingSuccessCurrentRequest.groups.forEach(groupId => {

                    const newInstanceIndex = Object.keys(loadingSuccessRegistry).length + 1;

                    const newInstance = ThermalFileInstance.fromSource( groupId, `file_${newInstanceIndex}`, existingSource.source );

                    // Add the group to the registry
                    existingSource.instancesByGroupId[groupId] = newInstance;

                    // Add the item to the group
                    loadingSuccessGroups[groupId].instancesByUrl[newInstance.id] = newInstance;

                });

                // Then remove the request from the existing ones
                const { [action.payload.url]: oldOne, ...loadingSuccessRequestsNew } = loadingSuccessRequests;

                loadingSuccessRequests = loadingSuccessRequestsNew;


            }


            return {
                ...loadingSuccessState,
                registryByUrl: loadingSuccessRegistry,
                requestsPendingByUrl: loadingSuccessRequests,
                groups: loadingSuccessGroups
            } as ThermalStorageNew


    }

    return state;
}