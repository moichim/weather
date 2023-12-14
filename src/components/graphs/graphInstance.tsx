"use client"

import { GraphInstanceState } from "@/state/useGraphStack/storage"
import { GraphSelector } from "./components/graphSelector"
import { UseGraphStackInstanceType, useGraphStackInstance } from "./useGraphStackInstance"
import { GraphCanvas } from "./components/graphCanvas"
import { useGraphContext } from "@/state/graphStackContext"
import { GraphTable } from "./components/graphTable"
import { ButtonGroup } from "@nextui-org/react"
import { GraphConfigScale } from "./components/graphConfigScale"
import { GraphConfigPopup } from "./components/graphConfigPopup"
import { GraphRemoveButton } from "./components/graphRemoveButton"
import { useMeteoContext } from "@/state/useMeteoData/meteoDataContext"
import { useMemo } from "react"
import { useGraphInstanceMeteo } from "./useGraphinstanceMeteo"
import { GraphStatistics } from "./components/graphStatistics"
import { GraphView } from "./components/graphView"

export type GraphInstanceWithDataPropsType = GraphInstanceState & {
    data: UseGraphStackInstanceType
}

export const GraphInstance: React.FC<GraphInstanceState> = props => {

    const data = useGraphStackInstance( props.property.slug );
    const {stack} = useGraphContext();


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