import { addDays, format } from "date-fns";

export function stringFromDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}
export function dateFromString(date: string) {
    return new Date(date);
}

export const getAddedDate = ( date: string, numDays: number ) => stringFromDate( addDays( dateFromString( date ), numDays ) );

export const getTodayDateString = () => stringFromDate( new Date )