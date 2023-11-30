import { useFilterContext } from "@/state/filterContext"
import { dateFromString, stringFromDate } from "@/utils/time";
import { Button, Input } from "@nextui-org/react";
import { addDays, subDays } from "date-fns";
import { useEffect, useMemo } from "react";

export const DateFilter: React.FC = () => {

    const filter = useFilterContext();

    useEffect(() => {
        filter.setTo(filter.from)
    }, [filter]);

    const setDates = (date: string) => {
        filter.setFrom(date);
        filter.setTo(date);
    }

    const dayBefore = useMemo(() => {
        return stringFromDate(subDays(dateFromString(filter.from), 1))
    }, [filter.from]);

    const dayAfter = useMemo(() => {
        return stringFromDate(addDays(dateFromString(filter.from), 1))
    }, [filter.from]);

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
            value={filter.from}
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