"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Button, Tooltip, cn } from "@nextui-org/react";
import { TimeEventsFactory } from "../../reducerInternals/actions";
import { TimeFormat } from "../../reducerInternals/timeUtils/formatting";
import { useTimeContext } from "../../timeContext";
import { ModificationModeSwitch } from "../modificationModeSwitch";
import { ButtonArrow } from "./arrowButton";

export const FromControl: React.FC = () => {

    const { timeState, timeDispatch } = useTimeContext();

    return <Tooltip
        content={<ModificationModeSwitch />}
        className="p-4 text-xs"
    ><div
        className="flex group items-stretch content-stretch"
    >

            <ButtonArrow 
                direction="left"
                onDo={ () => timeDispatch( TimeEventsFactory.modifyRangeFrom(-1) ) }
                mayDo={ timeState.mayLowerFrom }
            />

            <div className="py-1 px-3 text-center bg-background text-foreground border-2 border-s-0 border-r-0 border-gray-300 group-hover:border-primary-300 h-14 min-w-[7rem]">
                <div className="">{TimeFormat.humanDate(timeState.from)}</div>
                <div className="text-xs w-full flex justify-between">
                    <span className="group-hover:text-primary-500 opacity-50 group-hover:opacity-100">OD</span>
                    <span>{TimeFormat.humanTime(timeState.from)}</span>
                </div>
            </div>

            <ButtonArrow 
                direction="right"
                onDo={ () => timeDispatch( TimeEventsFactory.modifyRangeFrom(1) ) }
                mayDo={ timeState.mayRiseFrom }
            />

        </div>

    </Tooltip>

}