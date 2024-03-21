"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { TimeFormat } from "../reducerInternals/timeUtils/formatting";
import { useTimeContext } from "../timeContext";
import { CloseIcon, ZoomInIcon } from "@/components/ui/icons";
import { TimeEventsFactory, TimePeriod } from "../reducerInternals/actions";
import { formatDuration, intervalToDuration } from "date-fns";

export const SelectionBar: React.FC = () => {

    const { timeState: state, timeDispatch: dispatch } = useTimeContext();

    if (state.hasSelection === false) {
        return <></>
    }

    return <div className="fixed w-0 left-1/2 bottom-4 h-40">
        <div className="w-80 mx-auto absolute bottom-0 -left-40 rounded-2xl p-4 border-2 border-gray-400 border-solid bg-foreground text-background backdrop-opacity-80">
            <div className="flex w-full gap-2">
                <div className="flex-grow">
                    <h2 className="text-sm opacity-70">Vyznačená oblast</h2>
                    <p>{TimeFormat.humanRangeDates(state.selectionFrom!, state.selectionTo!)}</p>
                </div>

                <Tooltip
                    content="Přiblížit na vyznačenou oblast"
                >
                    <Button
                        onClick={() => dispatch(TimeEventsFactory.setRange(state.selectionFrom!, state.selectionTo!, TimePeriod.DAY))}
                        isIconOnly
                    >
                        <ZoomInIcon />
                    </Button>
                </Tooltip>

                <Tooltip
                    content="Zrušit výběr"
                >
                    <Button
                        onClick={() => dispatch(TimeEventsFactory.clearSelection())}
                        isIconOnly
                    >
                        <CloseIcon />
                    </Button>
                </Tooltip>

            </div>

            <p className="text-sm opacity-70">{formatDuration(
                intervalToDuration({ start: state.selectionFrom!, end: state.selectionTo! })
            )}</p>

        </div>
    </div>

}