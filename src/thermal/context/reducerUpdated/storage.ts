import {ThermalFileInstance} from "@/thermal/reader/ThermalFileInstance"
import {ThermalFileSource} from "@/thermal/reader/ThermalFileSource"

export enum ThermalImageLoadingState {
    LOADING = 0,
    PENDING = 1,
    LOADED = 2,
    ERROR = 3
}

export type ThermalGroupType = {
    min: number|undefined,
    max: number|undefined,

    from: number|undefined,
    to: number|undefined,

    cursorX: number|undefined,
    cursorY: number|undefined,

    bypass: boolean,

    instancesById: {
        [index:string]: ThermalFileInstance
    },

    requests: {}

}

type ThermalRequestType = {

    url: string,
    status: ThermalImageLoadingState,
    groups: string[]

}

type ThermalRequestRegistryType = {
    [index:string]: ThermalRequestType
}

type ThermalResultRegistryType = {
    url: string,
    source: ThermalFileSource,
    instancesByGroupId: {
        [index: string]: ThermalFileInstance
    }
}

export type ThermalStorageNew = {

    min: number|undefined,
    max: number|undefined,

    from: number|undefined,
    to: number|undefined,

    requestedUrls: string[];

    requestsFiredByUrl: ThermalRequestRegistryType,

    requestsPendingByUrl: ThermalRequestRegistryType,

    registryByUrl: {
        [index:string]: ThermalResultRegistryType
    },

    groups: {
        [index:string]: ThermalGroupType
    }

}

export const thermalStorageNewDefaults: ThermalStorageNew = {
    min: undefined,
    max: undefined,
    from: undefined,
    to: undefined,
    requestedUrls: [],
    requestsFiredByUrl: {},
    requestsPendingByUrl: {},
    registryByUrl: {},
    groups: {}
}