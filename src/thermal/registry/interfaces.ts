
import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../reader/ThermalFileSource";

// Source registered
export type ThermalSourceAddedEventDetail = {
    source: ThermalFileSource
}

// Group instances
export type ThermalInstanceAddedEventDetail = {
    instance: ThermalFileInstance
}


// Range

export type ThermalRangeType = {
    from: number,
    to: number
}

export type ThermalRangeOrUndefined = ThermalRangeType | undefined;

export type ThermalRangeDataType = ThermalRangeOrUndefined & {
    from: number,
    to: number
}

export type ThermalRangeEventDetails = {
    range: ThermalRangeOrUndefined,
    imposed: boolean
}

export interface IThermalWithRange {
    range: ThermalRangeOrUndefined
}


// Min Max

export interface IThermalWithMinMax {
    min: number,
    max: number
}
export type ThermalMinmaxOrUndefined = IThermalWithMinMax | undefined;

export type ThermalMinmaxEventDetail = {
    minmax: ThermalMinmaxOrUndefined,
    imposed: boolean
}


// Cursor

export type ThermalCursorPosition = {
    x: number,
    y: number
}

export type ThermalCursorPositionOrundefined = ThermalCursorPosition | undefined;

export type ThermalCursorEventDetail = {
    value: number|undefined,
    position: ThermalCursorPositionOrundefined,
    isHover: boolean,
    isSync: boolean
}

export interface IThermalWithCursor {

    cursorPosition: ThermalCursorPositionOrundefined,
    cursorValue: number|undefined,
    isHover: boolean

}

export type ThermalCursorGroupEventDetail = {
    position: ThermalCursorPositionOrundefined,
    imposed: boolean,
    isHover: boolean
}

export type ThermalCursorInstanceEventDetail = ThermalCursorGroupEventDetail & {
    value: number|undefined
}