type TimeType = {
    from: number,
    to: number
}

export type TimeStoragePresetType = TimeType & {
    name: string,
    active: boolean
}

export type TimeStorageType = TimeType & {
    default: TimeType,
    presets: {
        [index: string]: TimeStoragePresetType
    },
    selectionFrom?: number,
    selectionTo?: number,
    cursorFrom?: number,
    cursorTo?: number

}