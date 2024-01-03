"use client";

import { Button } from "@nextui-org/react";
import { RangeDisplay } from "../../../../components/graphs/rangeDisplay";
import { Filter } from "../../../meteo/components/filter/filter";
import { useGraphContext } from "../../graphContext";
import { StackActions } from "../../reducerInternals/actions";
import { GraphSizesButtonGroup } from "../graphSizesButtonGroup";

export const BarPanel: React.FC<React.PropsWithChildren> = props => {

    const {graphDispatch} = useGraphContext();

    return <div className="w-full flex items-center gap-3">

        <Filter />

        <GraphSizesButtonGroup />

        <Button
            onClick={()=>graphDispatch( StackActions.setTourRunning(true) )}
        >Prohlídka funkcí</Button>

        <RangeDisplay />
        

    </div>
    
}