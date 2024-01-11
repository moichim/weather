"use client";

import { Button } from "@nextui-org/react";
import { RangeDisplay } from "./rangeDisplay";
import { Filter } from "./filter/filter";
import { useGraphContext } from "../../state/graph/graphContext";
import { StackActions } from "../../state/graph/reducerInternals/actions";
import { GraphSizesButtonGroup } from "./graphSizesButtonGroup";
import { BarContainer } from "./barContainer";

export const BarPanel: React.FC<React.PropsWithChildren> = props => {

    const { graphDispatch } = useGraphContext();

    return <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
        <BarContainer
            id="barFilter"
            label="Časový rozsah"
        >
            <Filter />
        </BarContainer>

        <BarContainer id="barSizing" label="Nastavit velikost grafů">
            <GraphSizesButtonGroup />
        </BarContainer>

        <BarContainer id="barTour" label="Nápověda">
            <Button
                onClick={() => graphDispatch(StackActions.setTourRunning(true))}
            >Prohlídka funkcí</Button>
        </BarContainer>

        <RangeDisplay />


    </div>

}