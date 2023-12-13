export type DataStorageType = {

    scope: string,
    
    fromTimestamp: number,
    fromInternalString: string,
    fromHumanReadable: string,
    
    toTimestamp: number,
    toInternalString: string,
    toHumanReadable: string,
    
    viewDurationDays: number,
    
    rangeMinTimestamp?: number,
    rangeMinInternalString?: string,
    rangeMinHumanReadable?: string,

    rangeMaxTimestamp?: number,
    rangeMaxInternalString?: string,
    rangeMaxMumanReadable?: string,

    rangeDurationHours?: number,

    hasRange: boolean,

}