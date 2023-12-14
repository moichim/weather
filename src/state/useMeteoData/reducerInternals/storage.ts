export type MeteoStorageType = {

    scope: string,
    
    fromTimestamp: number,
    fromInternalString: string,
    fromHumanReadable: string,
    
    toTimestamp: number,
    toInternalString: string,
    toHumanReadable: string,
    
    viewDurationString: string,
    
    rangeMinTimestamp?: number,
    rangeMinInternalString?: string,
    rangeMinHumanReadable?: string,

    rangeMaxTimestamp?: number,
    rangeMaxInternalString?: string,
    rangeMaxMumanReadable?: string,

    rangeDurationString?: string,

    hasRange: boolean,

}