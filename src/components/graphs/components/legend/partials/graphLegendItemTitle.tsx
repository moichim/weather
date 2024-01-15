import { GraphLegendColumnDetailProps } from "./GraphLegendItemDetail";

export const GraphLegendItemTitle: React.FC<GraphLegendColumnDetailProps> = props => {

    return <div className="flex items-center gap-3 w-full">
        <div className="h-4 w-4 rounded-full" style={{backgroundColor:props.color}}></div>
        <h4>{props.name}</h4>
    </div>


}