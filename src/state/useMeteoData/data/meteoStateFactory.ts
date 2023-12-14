import { addDays } from "date-fns";
import { MeteoStorageType } from "../reducerInternals/storage";
import { FormattedDatePair, formatViewDatesFromTimestamps, getDurationString } from "../reducerInternals/reducer";

export class MeteoStateFactory {

    public static buildRelativeSelectionDates(
        fromDaysModification: number,
        toDayModification: number
    ): FormattedDatePair {

        const from = addDays(new Date, fromDaysModification);
        const to = addDays(new Date, toDayModification);
        return formatViewDatesFromTimestamps(from.getTime(), to.getTime());

    }

    protected static getStateBase() {
        return {
            scope: "core",

            viewDurationDays: 0,

            rangeMinTimestamp: undefined,
            rangeMinInternalString: undefined,
            rangeMinHumanReadable: undefined,

            rangeMaxTimestamp: undefined,
            rangeMaxInternalString: undefined,
            rangeMaxMumanReadable: undefined,

            rangeDurationHours: undefined,

            hasRange: false,

        }
    }

    public static defaultState(): MeteoStorageType {

        const { from, to } = MeteoStateFactory.buildRelativeSelectionDates(-3, 0);

        return {
            ...MeteoStateFactory.getStateBase(),

            fromInternalString: from.internal,
            fromTimestamp: from.timestamp,
            fromHumanReadable: from.humanReadable,

            toInternalString: to.internal,
            toTimestamp: to.timestamp,
            toHumanReadable: to.humanReadable,
            
            viewDurationString: getDurationString(from.date,to.date)
        }

    }

}