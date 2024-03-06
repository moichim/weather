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


// Min Max

export interface ThermalMinmaxType {
    min: number,
    max: number
}
export type ThermalMinmaxOrUndefined = ThermalMinmaxType | undefined;


// Cursor

export type ThermalCursorPosition = {
    x: number,
    y: number
}

export type ThermalCursorPositionOrundefined = ThermalCursorPosition | undefined;