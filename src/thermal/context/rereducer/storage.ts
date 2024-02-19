import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance"
import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource"

type ThermoStorageStats = {
    min: number,
    max: number,
} | {
    min: undefined,
    max: undefined,
}

const thermoStorageStatsUndefined = {
    min: undefined,
    max: undefined,
}

type ThermoCursorPositionType = {
    cursorX: number,
    cursorY: number
} | {
    cursorX: undefined,
    cursorY: undefined
}

const thermoCursorPositionUndefined: ThermoCursorPositionType = {
    cursorX: undefined,
    cursorY: undefined
}

type ThermoRange = {
    from: number,
    to: number
} | {
    from: undefined,
    to: undefined
}

const thermoRagngeUndefined: ThermoRange = {
    from: undefined,
    to: undefined
}


export type ThermoGroup = ThermoStorageStats & ThermoRange & {
    groupId: string,
    name?: string,
    description?: string,
    bypass: boolean,
    instancesByPath: {
        [index: string]: ThermalFileInstance
    }
}

export const thermoGroupFactory = (
    id: string,
    name?: string,
    description?: string
): ThermoGroup => {
    return {
        ...thermoStorageStatsUndefined,
        ...thermoCursorPositionUndefined,
        ...thermoRagngeUndefined,
        groupId: id,
        name,
        description,
        bypass: false,
        instancesByPath: {}
    }
}



export type ThermoStorageType = ThermoStorageStats & ThermoRange & {

    groups: {
        [index: string]: ThermoGroup
    }

    sourcesByPath: {
        [index:string]: ThermalFileSource
    }

    instancesById: {
        [index:string]: ThermalFileInstance
    }

}

export const thermoStorageFactory = (): ThermoStorageType => {
    return {
        ...thermoStorageStatsUndefined,
        ...thermoRagngeUndefined,
        instancesById: {},
        sourcesByPath: {},
        groups: {}
    }
}