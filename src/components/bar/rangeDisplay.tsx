"use client"

import { useMeteoContext } from "@/state/meteo/meteoContext";
import { DataActionsFactory } from "@/state/meteo/reducerInternals/actions";
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import { CloseIcon, ZoomInIcon } from "../ui/icons";
import { BarContainer } from "@/components/bar/barContainer";

export const RangeDisplay: React.FC = () => {

    const { selection, dispatch } = useMeteoContext();

    if (!selection.hasRange) return <></>

    return <>
        <div className="grow"></div>
        <BarContainer id="barRange" label="Vyznačený rozsah">
        <div className="flex items-center justify-center gap-2">
            <Tooltip content={selection.rangeDurationString} color="foreground" showArrow size="lg">
                <div className="rounded-xl bg-background text-foreground px-6 py-3 cursor-help">
                    {selection.rangeMinHumanReadable} - {selection.rangeMaxMumanReadable}
                </div>
            </Tooltip>
            <Tooltip
                content="Přiblížit na zvýrazněný rozsah"
                color="foreground"
                showArrow
            >
                <Button
                    onClick={() => dispatch(DataActionsFactory.setFilterTimestamp(selection.rangeMinTimestamp!, selection.rangeMaxTimestamp!))}
                    isIconOnly
                    className="bg-background text-foreground"
                    size="lg"
                >
                    <ZoomInIcon />
                </Button>
            </Tooltip>
            <Tooltip
                content="Zrušit výběr"
                color="foreground"
                showArrow
            >
                <Button
                    onClick={() => dispatch(DataActionsFactory.removeRange())}
                    isIconOnly
                    className="bg-background text-foreground"
                    size="lg"
                >
                    <CloseIcon />
                </Button>
            </Tooltip>
        </div>
        </BarContainer>
    </>

}