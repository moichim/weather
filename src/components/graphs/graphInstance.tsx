"use client"

import { GraphInstanceState } from "@/state/graph/reducerInternals/storage"
import { ButtonGroup, Divider } from "@nextui-org/react"
import { GraphConfigPopup } from "./components/graphConfigPopup"
import { GraphConfigScale } from "./components/graphConfigScale"
import { GraphRemoveButton } from "./components/graphRemoveButton"
import { GraphSelector } from "./components/graphSelector"
import { GraphStatistics } from "./components/graphStatistics"
import { GraphView } from "./components/graphView"
import { Suspense } from "react"

export type GraphInstanceWithDataPropsType = GraphInstanceState

export const GraphInstance: React.FC<GraphInstanceState> = props => {

    return <div id={props.id} className="flex w-full flex-wrap lg:flex-nowrap gap-2 p-3">

        <div id={props.id + "Header"} className="w-full lg:w-1/6 flex items-center justify-center lg:items-end lg:justify-start flex-col md:flex-row lg:flex-col gap-3">

            <div className="w-full flex gap-2 justify-center md:justify-start lg:justify-end items-center md:pl-16 lg:pl-0">
                <GraphSelector {...props} />
            </div>

            <div className="w-full flex gap-2 items-center lg:items-end justify-center md:justify-end lg:justify-end lg:flex-col">

                <ButtonGroup size="sm" id={`${props.id}sizes`}>
                    <GraphConfigScale {...props} />
                </ButtonGroup>
                <ButtonGroup size="sm">
                    <GraphConfigPopup {...props} />
                    <GraphRemoveButton {...props} />
                </ButtonGroup>

            </div>

        </div>

        <div id={props.id + "Content"} className="w-full lg:w-2/3">
            <GraphView {...props} />
        </div>

        <div id={props.id + "Statistics"} className="w-full lg:w-1/3 md:pl-16 lg:pl-0">
            <GraphStatistics {...props} />
        </div>

        <Divider className="lg:hidden my-16" />
    </div>

}