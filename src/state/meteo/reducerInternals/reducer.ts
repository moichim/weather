import { dateFromString } from "@/utils/time";
import { addDays, format, intervalToDuration, subDays, subMonths } from "date-fns";
import { Reducer } from "react";
import { DataAction, DataActions, DataPayloadBase, SetFilterSringPayload, SetFilterTimestampPayload, SetRangeTimestampPayload, SetScopePayload, StartSelectingRangePayload } from "./actions";
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

export const getSelectionRange = () => {
    let min = new Date();
    min = subMonths(min, 3);
    min.setHours(0);
    min.setMinutes(0);
    min.setSeconds(0);
    min.setMilliseconds(0);

    let max = new Date();
    max = subDays(max, 1);

    return {
        fromSelectionMin: roundFromTimestamp(min.getTime()).internal,
        toSelectionMin: roundToTimestamp(max.getTime()).internal
    }

}

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
    d.setHours(24);
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
        humanReadable: format(d, "d. M. y H:mm"),
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

    return buffer.join(", ");

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
                rangeTempFromTimestamp: undefined,
                rangeTempToTimestamp: undefined,
                isSelectingRange: false,
                rangeMinTimestamp: undefined,
                rangeMinInternalString: undefined,
                rangeMinHumanReadable: undefined,
                rangeMaxTimestamp: undefined,
                rangeMaxInternalString: undefined,
                rangeMaxMumanReadable: undefined,
                rangeDurationString: undefined,
                hasRange: false,
                ...getSelectionRange()
            } as MeteoStorageType;


        case DataActions.SET_FILTER_STRING:

            const { from: setFilterFrom, to: setFilterTo } = getPayload<SetFilterSringPayload>(action);

            const { from: sff, to: sft } = formatViewDatesFromStrings(setFilterFrom, setFilterTo);

            let doResetRangeString = false;

            if (state.rangeMinTimestamp)
                if (state.rangeMinTimestamp < sff.timestamp)
                    doResetRangeString = true;

            if (state.rangeMaxTimestamp)
                if (state.rangeMaxTimestamp > sft.timestamp)
                    doResetRangeString = true;

            const newRangeString = doResetRangeString
                ? {
                    rangeTempFromTimestamp: undefined,
                    rangeTempToTimestamp: undefined,
                    isSelectingRange: false,
                    rangeMinTimestamp: undefined,
                    rangeMinInternalString: undefined,
                    rangeMinHumanReadable: undefined,
                    rangeMaxTimestamp: undefined,
                    rangeMaxInternalString: undefined,
                    rangeMaxMumanReadable: undefined,
                    rangeDurationString: undefined,
                    hasRange: false
                }
                : {};

            return {
                ...state,

                fromInternalString: sff.internal,
                fromTimestamp: sff.timestamp,
                fromHumanReadable: sff.humanReadable,

                toInternalString: sft.internal,
                toTimestamp: sft.timestamp,
                toHumanReadable: sft.humanReadable,

                viewDurationString: getDurationString(sff.date, sft.date),

                ...newRangeString

            };


        case DataActions.SET_FILTER_TIMESTAMP:

            const { from: setFilterFromTimestamp, to: setFilterToTimestamp } = getPayload<SetFilterTimestampPayload>(action);

            const { from: tff, to: tft } = formatViewDatesFromTimestamps(setFilterFromTimestamp, setFilterToTimestamp);

            let doResetRange = false;

            if (state.rangeMinTimestamp)
                if (state.rangeMinTimestamp < tff.timestamp)
                    doResetRange = true;

            if (state.rangeMaxTimestamp)
                if (state.rangeMaxTimestamp > tft.timestamp)
                    doResetRange = true;

            const newRange = doResetRange
                ? {
                    rangeTempFromTimestamp: undefined,
                    rangeTempToTimestamp: undefined,
                    isSelectingRange: false,
                    rangeMinTimestamp: undefined,
                    rangeMinInternalString: undefined,
                    rangeMinHumanReadable: undefined,
                    rangeMaxTimestamp: undefined,
                    rangeMaxInternalString: undefined,
                    rangeMaxMumanReadable: undefined,
                    rangeDurationString: undefined,
                    hasRange: false
                }
                : {};

            return {
                ...state,

                fromInternalString: tff.internal,
                fromTimestamp: tff.timestamp,
                fromHumanReadable: tff.humanReadable,

                toInternalString: tft.internal,
                toTimestamp: tft.timestamp,
                toHumanReadable: tft.humanReadable,

                viewDurationString: getDurationString(tff.date, tft.date),

                ...newRange

            };

        case DataActions.SET_RANGE_TIMESTAMP:

            const { from: setRangeFrom, to: setRangeTo } = getPayload<SetRangeTimestampPayload>(action);

            const { from: setRangeFromFormatted, to: setRangeToFormatted } = formatRangeDatesFromTimestamp(setRangeFrom, setRangeTo);

            return {
                ...state,

                rangeTempFromTimestamp: undefined,
                rangeTempToTimestamp: undefined,

                isSelectingRange: false,

                rangeMinTimestamp: setRangeFromFormatted.timestamp,
                rangeMinInternalString: setRangeFromFormatted.internal,
                rangeMinHumanReadable: setRangeFromFormatted.humanReadable,

                rangeMaxTimestamp: setRangeToFormatted.timestamp,
                rangeMaxInternalString: setRangeToFormatted.internal,
                rangeMaxMumanReadable: setRangeToFormatted.humanReadable,

                rangeDurationString: getDurationString(setRangeFromFormatted.date, setRangeToFormatted.date),

                hasRange: true

            };


        case DataActions.REMOVE_RANGE:
            return {
                ...state,

                rangeTempFromTimestamp: undefined,
                rangeTempToTimestamp: undefined,

                isSelectingRange: false,

                rangeMinTimestamp: undefined,
                rangeMinInternalString: undefined,
                rangeMinHumanReadable: undefined,

                rangeMaxTimestamp: undefined,
                rangeMaxInternalString: undefined,
                rangeMaxMumanReadable: undefined,

                rangeDurationString: undefined,

                hasRange: false,
                ...getSelectionRange()
            }

        case DataActions.START_SELECTING_RANGE:

            const { timestamp: startRangeTimestamp } = getPayload<StartSelectingRangePayload>(action);

            return {
                ...state,
                rangeTempFromTimestamp: startRangeTimestamp,
                rangeTempToTimestamp: undefined,

                isSelectingRange: true,

                rangeMinTimestamp: undefined,
                rangeMinInternalString: undefined,
                rangeMinHumanReadable: undefined,

                rangeMaxTimestamp: undefined,
                rangeMaxInternalString: undefined,
                rangeMaxMumanReadable: undefined,

                rangeDurationString: undefined,

                hasRange: false,
                ...getSelectionRange()
            }

        case DataActions.END_SELECTING_RANGE:

            const { timestamp: endRangeTimestamp } = getPayload<StartSelectingRangePayload>(action);

            const { from: finishFromFormatted, to: finishToFormatted } = formatRangeDatesFromTimestamp(state.rangeTempFromTimestamp!, endRangeTimestamp);

            return {
                ...state,
                rangeTempFromTimestamp: undefined,
                rangeTempToTimestamp: undefined,

                isSelectingRange: false,

                rangeMinTimestamp: finishFromFormatted.timestamp,
                rangeMinInternalString: finishFromFormatted.internal,
                rangeMinHumanReadable: finishFromFormatted.humanReadable,

                rangeMaxTimestamp: finishToFormatted.timestamp,
                rangeMaxInternalString: finishToFormatted.internal,
                rangeMaxMumanReadable: finishToFormatted.humanReadable,

                rangeDurationString: getDurationString(finishFromFormatted.date, finishToFormatted.date),

                hasRange: true,
                ...getSelectionRange()
            }


        default:
            return state;

    }


}