import { ThermalFileInstance } from "@/thermal/reader/ThermalFileInstance"
import { ThermalFileSource } from "@/thermal/reader/ThermalFileSource"
import { CSSProperties } from "react"

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
    cursorY: number,
} | {
    cursorX: undefined,
    cursorY: undefined,
}

const thermoCursorPositionUndefined: ThermoCursorPositionType = {
    cursorX: undefined,
    cursorY: undefined,
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


export type ThermoGroup = ThermoStorageStats & ThermoRange & ThermoCursorPositionType & {
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
        instancesByPath: {},
        cursorX: undefined,
        cursorY: undefined
    }
}



export type ThermoStorageType = ThermoStorageStats & ThermoRange & {

    sourcesByPath: {
        [index:string]: ThermalFileSource
    }

    instancesById: {
        [index:string]: ThermalFileInstance
    }

    groups: {
        [index: string]: ThermoGroup
    }

}

export const thermoStorageFactory = (): ThermoStorageType => {
    return {
        ...thermoStorageStatsUndefined,
        ...thermoRagngeUndefined,
        instancesById: {},
        sourcesByPath: {},
        groups: {},
    }
}