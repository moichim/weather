import { addDays, format } from "date-fns";

export function stringFromDate(date: Date) {
    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampFrom(timestamp: number) {

    const date = new Date;
    date.setTime(timestamp);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return format(date, "yyyy-MM-dd");
}

export function stringFromTimestampTo(timestamp: number) {

    const date = new Date;
    date.setTime(timestamp);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return format(date, "yyyy-MM-dd");
}

export function dateFromString(date: string) {
    return new Date(date);
}

export function stringFromTimestamp(timestamp: number) {
    const date = new Date;
    date.setTime(timestamp);
    return format(date, "yyyy-MM-dd");
}

export function timestampFromFromString(date: string) {
    const d = dateFromString(date);

    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d.getTime();
}

export function timestampToFromString(date: string) {
    const d = dateFromString(date);

    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d.getTime();
}

export const getAddedDate = (date: string, numDays: number) => stringFromDate(addDays(dateFromString(date), numDays));

export const getTodayDateString = () => stringFromDate(new Date)