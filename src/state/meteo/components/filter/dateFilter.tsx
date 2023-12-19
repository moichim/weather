import { useMeteoContext } from "@/state/meteo/meteoContext";
import { DataActionsFactory } from "@/state/meteo/reducerInternals/actions";
import { dateFromString, stringFromDate, timestampFromFromString, timestampToFromString } from "@/utils/time";
import { Button, Input } from "@nextui-org/react";
import { addDays, subDays } from "date-fns";
import { useEffect, useMemo } from "react";

export const DateFilter: React.FC = () => {

    const context = useMeteoContext();

    useEffect( () => {
        context.dispatch( DataActionsFactory.setFilterString(
            context.selection.fromInternalString,
            context.selection.fromInternalString
        ) );
    }, [] );

    const setDates = (date: string) => {
        context.dispatch( DataActionsFactory.setFilterString( date, date ) );
    }

    const dayBefore = useMemo(() => {
        return stringFromDate(subDays(dateFromString(context.selection.fromInternalString), 1))
    }, [context.selection.fromInternalString]);

    const dayAfter = useMemo(() => {
        return stringFromDate(addDays(dateFromString(context.selection.toInternalString), 0))
    }, [context.selection.toInternalString]);

    const min = context.selection.fromSelectionMin;
    const max = context.selection.toSelectionMin;

    const hasMin = timestampFromFromString( context.selection.fromSelectionMin ) < context.selection.fromTimestamp;

    const hasMax = timestampToFromString( context.selection.toSelectionMin ) > context.selection.toTimestamp;

    return <>

        <Button
            isIconOnly
            size="lg"
            variant={hasMin ? "solid" : "flat"}
            className={!hasMin ? "cursor-not-allowed" : ""}
            title="Předchozí den"
            onClick={() => setDates(dayBefore)}
            disabled={!hasMin}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

        </Button>

        <Input
            type="date"
            value={context.selection.fromInternalString}
            onChange={event => setDates(event.target.value)}
            label="Datum"
            size="sm"
            min={min}
            max={max}
        />

        <Button
            isIconOnly
            size="lg"
            variant={hasMax ? "solid" : "flat"}
            className={!hasMax ? "cursor-not-allowed" : ""}
            title="Následující den"
            onClick={() => setDates(dayAfter)}
            disabled={!hasMax}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </Button>

    </>
}