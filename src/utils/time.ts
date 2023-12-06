import { addDays, format } from "date-fns";

export function stringFromDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampFrom(timestamp: number) {

    const date = new Date;
    date.setTime( timestamp );
    date.setHours( 0 );
    date.setMinutes( 0 );
    date.setSeconds( 0 );
    date.setMilliseconds( 0 );

    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampTo(timestamp: number) {

    const date = new Date;
    date.setTime( timestamp );
    date.setHours( 23 );
    date.setMinutes( 59 );
    date.setSeconds( 0 );
    date.setMilliseconds( 0 );

    return format(date, "yyyy-MM-dd");
}

export function dateFromString(date: string) {
    return new Date(date);
}

export const getAddedDate = ( date: string, numDays: number ) => stringFromDate( addDays( dateFromString( date ), numDays ) );

export const getTodayDateString = () => stringFromDate( new Date )