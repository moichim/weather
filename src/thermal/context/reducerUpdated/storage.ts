import {ThermalFileInstance} from "@/thermal/reader/ThermalFileInstance"
import {ThermalFileSource} from "@/thermal/reader/ThermalFileSource"

export enum ThermalImageLoadingState {
    LOADING = "FIRED",
    PENDING = "PENDING",
    LOADED = "LOADED",
    ERROR = "ERROR"
}

export type ThermalGroupType = {
    min: number|undefined,
    max: number|undefined,

    from: number|undefined,
    to: number|undefined,

    cursorX: number|undefined,
    cursorY: number|undefined,

    bypass: boolean,

    instancesByUrl: {
        [index:string]: ThermalFileInstance
    },

    requests: {}

}

export type ThermalRequestType = {

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

type ThermalResultType = {
    url: string,
    groupId: string,
    fileId: string,
    file: ThermalFileSource,
    request: ThermalRequestType
}

export type ThermalStorageNew = {

    min: number|undefined,
    max: number|undefined,

    from: number|undefined,
    to: number|undefined,

    requestedUrls: string[];

    requestsFiredByUrl: ThermalRequestRegistryType,

    requestsPendingByUrl: ThermalRequestRegistryType,

    resultsByPath: {
        [index:string]: ThermalResultType,
    },

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
    resultsByPath: {},
    registryByUrl: {},
    groups: {}
}