import { getTimeMax, getTimeMin, useFilterContext } from "@/state/filterContext";
import { getTodayDateString, getAddedDate, stringFromDate } from "@/utils/time";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { useMemo } from "react";

enum RangePreset {
    LAST_3 = 0,
    LAST_7 = 1,
    LAST_14 = 2,
    SINCE_EVER = 5
}

export const RangeFilter: React.FC = () => {

    const filter = useFilterContext();

    const min = useMemo(() => getTimeMin(), []);
    const max = useMemo(() => getTimeMax(), []);

    const applyPreset = ( preset: RangePreset ) => {

        const today = getTodayDateString();

        if ( preset == RangePreset.LAST_3 ) {

            filter.setFrom( getAddedDate( today , -3 ) );
            filter.setTo( today );

        }

        if ( preset == RangePreset.LAST_7 ) {

            filter.setFrom( getAddedDate( today , -7 ) );
            filter.setTo( today );

        }

        if ( preset == RangePreset.LAST_14 ) {

            filter.setFrom( getAddedDate( today , -14 ) );
            filter.setTo( today );

        }

        if ( preset == RangePreset.SINCE_EVER ) {

            filter.setFrom( stringFromDate( new Date( "2023-10-01" ) ) );
            filter.setTo( today );

        }

    }

    return <>
        <Input
            type="date"
            label="Od"
            size="sm"
            onChange={event => filter.setFrom(event.target.value)}
            value={filter.from}
            min={min}
            max={filter.to}
        />

        <Input
            type="date"
            label="Do"
            size="sm"
            onChange={event => filter.setTo(event.target.value)}
            value={filter.to}
            min={filter.from}
            max={max}
        />
        <div>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                        size="lg"
                        isIconOnly
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                    </Button>

                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Přednastavené datumy"
                    onAction={ key => applyPreset( key as RangePreset ) }
                >
                    <DropdownItem key={RangePreset.LAST_3}>Poslední 3 dny</DropdownItem>
                    <DropdownItem key={RangePreset.LAST_7}>Posledních 7 dní</DropdownItem>
                    <DropdownItem key={RangePreset.LAST_14}>Posledních 14 dní</DropdownItem>
                    <DropdownItem key={RangePreset.SINCE_EVER}>Od začátku měření</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </>;
}