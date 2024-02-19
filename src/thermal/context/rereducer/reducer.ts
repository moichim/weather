import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource";
import { ThermoStorageType, thermoGroupFactory } from "./storage"
import { calculateMinMax } from "../reducerUpdated/reducerUtils/numericalValues";
import { ThermalStorageType } from "../reducerInternals/storage";
import { Reducer } from "react";
import { AvailableThermoActions, RehookActions } from "./actions";

export const initGroup = (
    state: ThermoStorageType,
    id: string,
    name?: string,
    description?: string
): ThermoStorageType  => {
    return {
        ...state,
        groups: {
            ...state.groups,
            [id]: thermoGroupFactory( id, name, description )
        }
    };
}







export const instantiateSourceByUrl = (
    state: ThermoStorageType,
    url: string,
    group: string
): ThermoStorageType => {

    if( state.groups[group] === undefined )
        return state;
    if ( state.sourcesByPath[url] === undefined )
        return state;
    if ( state.groups[group] !== undefined ) {
        if ( state.groups[group].instancesByPath[url] !== undefined ) {
            return state;
        }
    }

    const source = state.sourcesByPath[url];
    const instance = source.createInstance( group, url );

    const newInstancesById = {
        ...state.instancesById,
        [instance.id]: instance
    }

    const newGroup = {...state.groups[group]};
    newGroup.instancesByPath[url] = instance;

    const newMinMax = calculateMinMax( 
        Object.values( newGroup.instancesByPath )
        .map(v=>v.getMinMax())
    );

    newGroup.min = newMinMax.min;
    newGroup.max = newMinMax.max;

    return {
        ...state,
        groups: {
            ...state.groups,
            [group]: newGroup
        },
        instancesById: newInstancesById
    }

}



export const startLoadingImage = (
    state: ThermoStorageType,
    groupId: string,
    url: string,
): ThermoStorageType => {

    // If this file is loading already, add it to subscriptions
    if ( state.loading.includes( url ) ) {
        if ( state.subscriptions[url] )
        if ( ! state.subscriptions[url].includes(groupId) ) {
            const subscription = [...state.subscriptions[url]]
            subscription.push( groupId );
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    [url]: subscription
                }
            }
        }
    }

    // If the file is loaded already, create a new instance in the new group
    else if ( state.sourcesByPath[url] ) {
        return instantiateSourceByUrl( state, url, groupId );
    }

    // Otherwise, create a new request
    return {
        ...state,
        loading: [
            ...state.loading,
            url
        ],
        subscriptions: {
            ...state.subscriptions,
            [url]: [groupId]
        }
    }

}



export const finishLoadingImage = (
    state: ThermoStorageType,
    source: ThermalFileSource
): ThermoStorageType => {


    if ( Object.keys( state.sourcesByPath ).includes( source.url ) ) {
        return state;
    }

    const newSources = {
        ...state.sourcesByPath,
        [source.url]: source
    }

    const newMinMax = calculateMinMax( 
        Object.values( newSources )
        .map(v=>v.getMinMax()) 
    );

    const result = {
        ...state,
        sourcesByPath: newSources,
        ...newMinMax,
        loaded: {
            ...state.loaded,
            [source.url]: source
        }
    }

    return result;

}



export const afterImageLoaded = (
    state: ThermoStorageType,
    url: string
) => {

    const updatedLoading = state.loading.filter( currentUrl => currentUrl !== url );

    if ( state.loaded[url] === undefined ) {
        return {
            ...state,
            loading: updatedLoading
        };
    }

    let stateWithRegisteredFile = finishLoadingImage( state, state.loaded[url] );

    for ( let subscribedGroup of state.subscriptions[url] ) {

        stateWithRegisteredFile = instantiateSourceByUrl( state, url, subscribedGroup );

    }

    // Remove the url and its subscriptions from the global state
    stateWithRegisteredFile.loading = updatedLoading;
    const {[url]:_ ,...newLoaded} = state.loaded;
    const {[url]:__,...newSubscriptions} = state.subscriptions;
    stateWithRegisteredFile.loaded = newLoaded;
    stateWithRegisteredFile.subscriptions = newSubscriptions;

    return stateWithRegisteredFile;

}

export const theRehookReducer: Reducer<ThermoStorageType, AvailableThermoActions > = (
    state, 
    action
) => {
    
    switch ( action.type ) {

        case RehookActions.INIT_GROUP:
            return initGroup( state, action.payload.groupId ?? "___" );

        case RehookActions.START_LOADING:
            return startLoadingImage( state, action.payload.groupId, action.payload.url );

        case RehookActions.FINISH_LOADING:
            return finishLoadingImage( state, action.payload.file );

        case RehookActions.AFTER_LOADED:
            return afterImageLoaded( state, action.payload.url );

    }

    return state;

}