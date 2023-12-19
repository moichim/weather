export type MeteoStorageType = {

    scope: string,
    
    fromTimestamp: number,
    fromInternalString: string,
    fromHumanReadable: string,
    
    toTimestamp: number,
    toInternalString: string,
    toHumanReadable: string,

    fromSelectionMin: string,
    toSelectionMin: string,
    
    viewDurationString: string,

    rangeTempFromTimestamp?: number,
    rangeTempToTimestamp?: number,
    
    rangeMinTimestamp?: number,
    rangeMinInternalString?: string,
    rangeMinHumanReadable?: string,

    rangeMaxTimestamp?: number,
    rangeMaxInternalString?: string,
    rangeMaxMumanReadable?: string,

    rangeDurationString?: string,

    hasRange: boolean,
    isSelectingRange: boolean,

}