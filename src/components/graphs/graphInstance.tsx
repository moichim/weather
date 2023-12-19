"use client"

import { GraphInstanceState } from "@/state/graph/reducerInternals/storage"
import { ButtonGroup } from "@nextui-org/react"
import { GraphConfigPopup } from "./components/graphConfigPopup"
import { GraphConfigScale } from "./components/graphConfigScale"
import { GraphRemoveButton } from "./components/graphRemoveButton"
import { GraphSelector } from "./components/graphSelector"
import { GraphStatistics } from "./components/graphStatistics"
import { GraphView } from "./components/graphView"

export type GraphInstanceWithDataPropsType = GraphInstanceState

export const GraphInstance: React.FC<GraphInstanceState> = props => {

    return <div className="flex w-full gap-2 p-3">
        <div className="w-1/6 flex items-end justify-start flex-col gap-3">
            <div>
                <GraphSelector {...props}/>
            </div>

            <ButtonGroup size="sm">
                <GraphConfigScale {...props} />
            </ButtonGroup>
            <ButtonGroup size="sm">
                <GraphConfigPopup {...props} />
                <GraphRemoveButton {...props} />
            </ButtonGroup>
        </div>
        
        <div className="w-2/3">
            <GraphView {...props}/>
        </div>
        <div className="w-1/3">
            <GraphStatistics {...props} />
        </div>
    </div>

}