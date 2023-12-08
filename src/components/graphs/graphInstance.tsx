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

            <ButtonGroup size="sm" className="shadow-xl">
                <GraphConfigPopup {...props} />
                <GraphConfigScale {...props} />
            </ButtonGroup>
        </div>
        
        <div className="w-2/3">
            <GraphCanvas {...props} data={data}/>
        </div>
        <div className="w-1/3">
            {( !stack.state.isSelecting && stack.state.selectionStart && stack.state.selectionEnd, !data.apiData.loading ) && <GraphTable {...props} data={data}/> }
        </div>
    </div>

}