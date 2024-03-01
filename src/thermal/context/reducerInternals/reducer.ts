import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource";
import { ThermoGroup, ThermoStorageType, thermoGroupFactory } from "./storage"
import { CSSProperties, Reducer } from "react";
import { AvailableThermoActions, CursorSetterType, RangeSetterType, ThermoActions } from "./actions";
import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance";
import { calculateMinMax } from "./reducerUtils/numericalValues";

const initGroup = (
    state: ThermoStorageType,
    id: string,
    name?: string,
    description?: string
): ThermoStorageType => {
    return {
        ...state,
        groups: {
            ...state.groups,
            [id]: thermoGroupFactory(id, name, description)
        }
    };
}


const addInstanceInGroup = (
    instance: ThermalFileInstance,
    group: ThermoGroup
): ThermoGroup => {

    const newGroup = { ...group };

    // Clone the index
    newGroup.instancesByPath = { ...group.instancesByPath }

    // Bind the instance
    newGroup.instancesByPath[instance.url] = instance;
    newGroup.instancesByPath = Object.fromEntries( 
        Object.entries( newGroup.instancesByPath ) 
            .sort( ([keyA, valueA],[keyB,valueB]) => {
                return valueA.timestamp - valueB.timestamp;
            } )
    );

    const updatedGroupMinMax = calculateMinMax(
        Object.values(newGroup.instancesByPath)
            .map(v => v.getMinMax())
    );

    newGroup.min = updatedGroupMinMax.min;
    newGroup.max = updatedGroupMinMax.max;

    return newGroup;

}


const createOneInstanceByUrl = (
    state: ThermoStorageType,
    url: string,
    group: string
): ThermoStorageType => {

    if (state.groups[group] === undefined)
        return state;
    if (state.sourcesByPath[url] === undefined)
        return state;
    if (state.groups[group] !== undefined) {
        if (state.groups[group].instancesByPath[url] !== undefined) {
            return state;
        }
    }

    const source = state.sourcesByPath[url];
    const instance = source.createInstance(group, url);

    const newGroup = addInstanceInGroup(instance, state.groups[group]);

    const newInstancesById = {
        ...state.instancesById,
        [instance.id]: instance
    }

    const { [group]: _, ...oldGroups } = state.groups;

    const result = {
        ...state,
        groups: {
            ...oldGroups,
            [group]: newGroup
        },
        instancesById: newInstancesById
    }

    return result;

}


const createMultipleInstancesByUrl = (
    state: ThermoStorageType,
    url: string,
    groups: string[]
): ThermoStorageType => {

    if (state.sourcesByPath[url] === undefined) {
        return state;
    }

    const source = state.sourcesByPath[url];

    const newGroups = { ...state.groups };
    const newInstancesById = { ...state.instancesById }

    groups.forEach(group => {

        if (newGroups[group] === undefined) {
            return;
        }

        const instance = source.createInstance(group, url);

        const newGroup = addInstanceInGroup(instance, newGroups[group]);
        newGroups[group] = newGroup;
        newInstancesById[instance.id] = instance;

    });

    return {
        ...state,
        groups: newGroups,
        instancesById: newInstancesById
    }

}



/**
 * Adds a file to the registry and recalculates the global numerical values
 */
const registerSourceFileInternal = (
    state: ThermoStorageType,
    source: ThermalFileSource
): ThermoStorageType => {


    if (Object.keys(state.sourcesByPath).includes(source.url)) {
        return state;
    }

    const newSources = {
        ...state.sourcesByPath,
        [source.url]: source
    }

    const newMinMax = calculateMinMax(
        Object.values(newSources)
            .map(v => v.getMinMax())
    );

    const result = {
        ...state,
        sourcesByPath: newSources,
        ...newMinMax,
    }

    return result;

}



const registerLoadedSource = (
    state: ThermoStorageType,
    file: ThermalFileSource,
    groups: string[]
) => {

    let stateWithRegisteredFile = registerSourceFileInternal(state, file);

    const stateWithAllInstances = createMultipleInstancesByUrl(stateWithRegisteredFile, file.url, groups);

    return stateWithAllInstances;

}


const groupSetCursor = (
    state: ThermoStorageType,
    groupId: string,
    cursor: CursorSetterType
): ThermoStorageType => {

    if (state.groups[groupId] === undefined) {
        return state;
    } else {

        const { groups: newGroups, ...restOfTheState } = state;

        const { [groupId]: { ...newGroup }, ...remainingGroups } = newGroups;

        newGroup.cursorX = cursor.x;
        newGroup.cursorY = cursor.y;

        // Update the group of every item except the currently hovering one
        Object.values(newGroup.instancesByPath).forEach(instance => {
            instance.setCursorFromOutside(cursor.x, cursor.y);
        });

        return {
            ...restOfTheState,
            groups: {
                ...state.groups,
                [groupId]: newGroup
            }
        }

    }

}

const groupAfterLoaded = (
    state: ThermoStorageType,
    groupId: string
): ThermoStorageType => {

    const { [groupId]:oldGroup, ...remainingGroups } = state.groups;

    

    const minMax = calculateMinMax( Object.values( oldGroup.instancesByPath ).map( i => i.getMinMax() ) );

    oldGroup.from = minMax.min;
    oldGroup.to = minMax.max;
    oldGroup.min = minMax.min;
    oldGroup.max = minMax.max;

    Object.values( oldGroup.instancesByPath ).forEach( i => i.setRangeFromTheOutside( minMax.min, minMax.max ) );

    return {
        ...state,
        groups: {
            ...remainingGroups,
            [groupId]: {...oldGroup}
        }
    }
}

const groupSetRange = (
    state: ThermoStorageType,
    groupId: string,
    range: RangeSetterType
): ThermoStorageType => {

    if (state.groups[groupId] === undefined) {
        return state;
    } else {

        const { groups: newGroups, ...restOfTheState } = state;

        const { [groupId]: { ...newGroup }, ...remainingGroups } = newGroups;

        newGroup.from = range.to;
        newGroup.to = range.to;

        // Update the group of every item except the currently hovering one
        Object.values(newGroup.instancesByPath).forEach(instance => {
            instance.setRangeFromTheOutside(range.from, range.to);
        });

        return {
            ...restOfTheState,
            groups: {
                ...state.groups,
                [groupId]: newGroup
            }
        }

    }

}


const globalSetRange = (
    state: ThermoStorageType,
    range: RangeSetterType
): ThermoStorageType => {

    Object.values( state.instancesById ).forEach( instance => {
        instance.setRangeFromTheOutside( range.from, range.to );
    } );

    Object.values( state.groups ).forEach( group => {
        group.from = range.from;
        group.to = range.to;
    } );

    return {
        ...state,
        from: range.from as number|undefined,
        to: range.to as number|undefined
    } as ThermoStorageType

}


const globalSetIrAspect = (
    state: ThermoStorageType,
    irAspect: number
): ThermoStorageType => {

    Object.values( state.instancesById ).forEach( instance => {
        instance.irAspect = irAspect;
    } );

    return {
        ...state,
        irAspect: irAspect
    }
}

export const theRehookReducer: Reducer<ThermoStorageType, AvailableThermoActions> = (
    state,
    action
) => {

    switch (action.type) {

        case ThermoActions.INIT_GROUP:
            return initGroup(state, action.payload.groupId ?? "___");

        case ThermoActions.REGISTER_LOADED_FILE:
            return registerLoadedSource(state, action.payload.file, action.payload.groups);

        case ThermoActions.INSTANTIATE_SOURCE_IN_GROUP:
            return createOneInstanceByUrl(state, action.payload.url, action.payload.groupId);

        case ThermoActions.INSTANTIATE_SOURCE_IN_MULTIPLE_GROUPS:
            return createMultipleInstancesByUrl(state, action.payload.url, action.payload.groups);

        case ThermoActions.GROUP_SET_CURSOR:
            return groupSetCursor(state, action.payload.groupId, action.payload.cursor);

        case ThermoActions.GROUP_SET_RANGE:
            return groupSetRange(state, action.payload.groupId, action.payload.range);

        case ThermoActions.GLOBAL_SET_RANGE:
            return globalSetRange( state, action.payload.range );

        case ThermoActions.GROUP_AFTER_EVERYTHING_LOADED:
            return groupAfterLoaded( state, action.payload.groupId );
        
        case ThermoActions.GLOBAL_SET_IR_ASPECT:
            return globalSetIrAspect( state, action.payload.irAspect );

    }

    return state;

}