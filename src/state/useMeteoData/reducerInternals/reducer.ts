import { dateFromString } from "@/utils/time";
import { format, intervalToDuration } from "date-fns";
import { Reducer } from "react";
import { DataAction, DataActions, DataPayloadBase, SetFilterSringPayload, SetFilterTimestampPayload, SetRangeTimestampPayload, SetScopePayload } from "./actions";
import { MeteoStorageType } from "./storage";

const getPayload = <T>(a: DataPayloadBase) => {
    return a.payload as T;
}

const orderDateStrings = (
    first: string,
    second: string
) => {

    const f = dateFromString(first).getTime();
    const s = dateFromString(second).getTime();

    if (f > s)
        return [second, first]

    return [first, second]

}

const orderTimestamps = (
    first: number,
    second: number
) => {

    if (first > second)
        return [second, first]

    return [first, second]

}


const roundFromString = (from: string) => {
    const d = roundFromTimestamp((new Date(from)).getTime());
    return d;
}

const roundToString = (to: string) => {
    const d = roundToTimestamp((new Date(to)).getTime());
    return d;
}

type FormattedDate = {
    timestamp: number,
    date: Date,
    humanReadable: string,
    internal: string
};

export type FormattedDatePair = {
    from: FormattedDate,
    to: FormattedDate
}

const roundFromTimestamp = (from: number): FormattedDate => {
    const d = new Date;
    d.setTime(from);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return {
        timestamp: d.getTime(),
        date: d,
        humanReadable: format(d, "d. M. y"),
        internal: format(d, "yyyy-MM-dd")
    };
}

const roundToTimestamp = (to: number): FormattedDate => {
    const d = new Date;
    d.setTime(to);
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);
    d.setMilliseconds(999);
    return {
        timestamp: d.getTime(),
        date: d,
        humanReadable: format(d, "d. M. y"),
        internal: format(d, "yyyy-MM-dd")
    };
}


export const formatViewDatesFromTimestamps = (from: number, to: number): FormattedDatePair => {

    const [f, t] = orderTimestamps(from, to);

    return {
        from: roundFromTimestamp(f),
        to: roundToTimestamp(t)
    };

}

const formatViewDatesFromStrings = (from: string, to: string): FormattedDatePair => {

    const [f, t] = orderDateStrings(from, to);

    return {
        from: roundFromString(f),
        to: roundToString(t)
    };

}

const formatRangeDate = (timestamp: number): FormattedDate => {
    const d = new Date;
    d.setTime(timestamp);
    return {
        timestamp: d.getTime(),
        date: d,
        humanReadable: format(d, "d. M. y H:m"),
        internal: format(d, "yyyy-MM-dd HH:mm:ss")
    }
}

const formatRangeDatesFromTimestamp = (from: number, to: number): FormattedDatePair => {

    const [f, t] = orderTimestamps(from, to);

    return {
        from: formatRangeDate(f),
        to: formatRangeDate(t)
    }
}


const getDurationObject = (
    from: Date,
    to: Date
) => {
    return intervalToDuration({
        start: from,
        end: to
    });
}

export const getDurationString = (
    from: Date,
    to: Date
) => {

    const object = getDurationObject(from, to);

    const buffer: string[] = [];

    if (object.years)
        buffer.push(`${object.years} let`);

    if (object.months)
        buffer.push(`${object.months} měsíců`);

    if (object.days)
        buffer.push(`${object.days} dnů`);

    if (object.hours)
        buffer.push(`${object.hours} hodin`);

    return buffer.join( ", " );

}





export const meteoReducer: Reducer<MeteoStorageType, DataAction<DataPayloadBase>> = (
    state,
    action
) => {

    switch (action.type) {


        case DataActions.SET_SCOPE:

            const { scope: setScopeScope } = getPayload<SetScopePayload>(action);

            return {
                ...state,
                scope: setScopeScope,
                rangeMinTimestamp: undefined,
                rangeMinInternalString: undefined,
                rangeMinHumanReadable: undefined,
                rangeMaxTimestamp: undefined,
                rangeMaxInternalString: undefined,
                rangeMaxMumanReadable: undefined,
                rangeDurationString: undefined,
                hasRange: false
            } as MeteoStorageType;


        case DataActions.SET_FILTER_STRING:

            const { from: setFilterFrom, to: setFilterTo } = getPayload<SetFilterSringPayload>(action);

            const { from: sff, to: sft } = formatViewDatesFromStrings(setFilterFrom, setFilterTo);

            return {
                ...state,

                fromInternalString: sff.internal,
                fromTimestamp: sff.timestamp,
                fromHumanReadable: sff.humanReadable,

                toInternalString: sft.internal,
                toTimestamp: sft.timestamp,
                toHumanReadable: sft.humanReadable,

                viewDurationString: getDurationString( sff.date, sft.date )

            };


        case DataActions.SET_FILTER_TIMESTAMP:

            const { from: setFilterFromTimestamp, to: setFilterToTimestamp } = getPayload<SetFilterTimestampPayload>(action);

            const { from: tff, to: tft } = formatViewDatesFromTimestamps(setFilterFromTimestamp, setFilterToTimestamp);

            return {
                ...state,

                fromInternalString: tff.internal,
                fromTimestamp: tff.timestamp,
                fromHumanReadable: tff.humanReadable,

                toInternalString: tft.internal,
                toTimestamp: tft.timestamp,
                toHumanReadable: tft.humanReadable,

                viewDurationString: getDurationString( tff.date, tft.date )

            };

        case DataActions.SET_RANGE_TIMESTAMP:

            const { from: setRangeFrom, to: setRangeTo } = getPayload<SetRangeTimestampPayload>(action);

            const { from: setRangeFromFormatted, to: setRangeToFormatted } = formatRangeDatesFromTimestamp(setRangeFrom, setRangeTo);

            return {
                ...state,

                rangeMinTimestamp: setRangeFromFormatted.timestamp,
                rangeMinInternalString: setRangeFromFormatted.internal,
                rangeMinHumanReadable: setRangeFromFormatted.humanReadable,

                rangeMaxTimestamp: setRangeToFormatted.timestamp,
                rangeMaxInternalString: setRangeToFormatted.internal,
                rangeMaxMumanReadable: setRangeToFormatted.humanReadable,

                rangeDurationString: getDurationString( setRangeFromFormatted.date, setRangeToFormatted.date ),

                hasRange: true

            };


        case DataActions.REMOVE_RANGE:
            return {
                ...state,

                rangeMinTimestamp: undefined,
                rangeMinInternalString: undefined,
                rangeMinHumanReadable: undefined,

                rangeMaxTimestamp: undefined,
                rangeMaxInternalString: undefined,
                rangeMaxMumanReadable: undefined,

                rangeDurationString: undefined,

                hasRange: false
            }


        default:
            return state;

    }


}