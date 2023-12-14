import { useFilterContext } from "@/state/filterContext"
import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext";
import { DataActionsFactory } from "@/state/useMeteoData/reducerInternals/actions";
import { dateFromString, stringFromDate } from "@/utils/time";
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
        return stringFromDate(addDays(dateFromString(context.selection.toInternalString), 1))
    }, [context.selection.toInternalString]);

    return <>

        <Button
            isIconOnly
            size="lg"
            variant="light"
            title="Předchozí den"
            onClick={() => setDates(dayBefore)}
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
        />

        <Button
            isIconOnly
            size="lg"
            variant="light"
            title="Následující den"
            onClick={() => setDates(dayAfter)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </Button>

    </>
}