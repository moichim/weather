import { dateFromString } from "@/utils/time";
import { format } from "date-fns";
import { Reducer } from "react";
import { DataAction, DataActions, DataPayloadBase, SetFilterSringPayload, SetFilterTimestampPayload, SetRangeTimestampPayload, SetScopePayload } from "./actions";
import { DataStorageType } from "./storage";

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


const formatViewDatesFromTimestamps = (from: number, to: number) => {

    const [f, t] = orderTimestamps(from, to);

    return {
        from: roundFromTimestamp(f),
        to: roundToTimestamp(t)
    };

}

const formatViewDatesFromStrings = (from: string, to: string) => {

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
        humanReadable: format(d, "d. M. y. H:m"),
        internal: format(d, "yyyy-MM-dd H:m:s")
    }
}

const formatRangeDatesFromTimestamp = (from: number, to: number) => {

    const [f, t] = orderTimestamps(from, to);

    return {
        from: formatRangeDate(f),
        to: formatRangeDate(t)
    }
}





export const useDataReducer: Reducer<DataStorageType, DataAction<DataPayloadBase>> = (
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
                rangeDuration: undefined,
                hasRange: false
            } as DataStorageType;


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
                toHumanReadable: sft.humanReadable

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
                toHumanReadable: tft.humanReadable

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

                rangeDuration: undefined,

                hasRange: false
            }


        default:
            return state;

    }


}