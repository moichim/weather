import { LegendWithDescription } from "../graphLegend";
import { GraphLegendItemTitle } from "./graphLegendItemTitle"

export type GraphLegendColumnDetailProps = {
    name: React.ReactNode,
    color: string,
    description?: React.ReactNode,
    link?: React.ReactNode
} & LegendWithDescription;

export const GraphLegendItemDetail:  React.FC<GraphLegendColumnDetailProps> = props => {

    return <div className="">

        <GraphLegendItemTitle {...props} />

        {( props.description && props.showDescription === true ) && <div>{props.description}</div>}

    </div>

}