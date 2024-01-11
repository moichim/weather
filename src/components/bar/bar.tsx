"use client";

import { useDisplayContext } from "@/state/graph/useBarInternal";
import { PropsWithChildren } from "react";
import { BarPanel } from "./barPanel";
import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { Button } from "@nextui-org/react";
import { BarContainer } from "./barContainer";
import { Filter } from "./filter/filter";
import { GraphSizesButtonGroup } from "./graphSizesButtonGroup";
import { RangeDisplay } from "./rangeDisplay";

export const Bar: React.FC<PropsWithChildren> = props => {

    const { graphDispatch } = useGraphContext();

    return <div className="w-full bottom-0 left-0 fixed lg:p-5 z-10">
        <div className="lg:rounded-xl shadow-2xl shadow-primary-900 bg-foreground text-background p-3 bg-opacity-90 lg:bg-opacity-70">
            <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
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
        </div>
    </div>

}