"use client"

import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext";
import { DataActionsFactory } from "@/state/useMeteoData/reducerInternals/actions";
import { Button, ButtonGroup } from "@nextui-org/react";

export const RangeDisplay: React.FC = () => {

    const { selection, dispatch } = useMeteoContext();

    if (!selection.hasRange) return <></>

    return <div className="absolute right-[4rem] bottom-10 rounded-lg shadow-xl bg-foreground  text-background px-6 py-4">
        <h1 className="text-sm text-gray-400 mb-2">Vybráno {selection.rangeDurationString}</h1>
        <p className="mb-2">{selection.rangeMinHumanReadable} - {selection.rangeMaxMumanReadable}</p>

        <ButtonGroup
            variant="solid"
            color="default"
        >
            <Button
                onClick={() => dispatch(DataActionsFactory.removeRange())}
            >Zrušit výběr</Button>
            <Button
                onClick={() => dispatch(DataActionsFactory.setFilterTimestamp( selection.rangeMinTimestamp!, selection.rangeMaxTimestamp! ))}
            >Přiblížit</Button>

        </ButtonGroup>
    </div>

}