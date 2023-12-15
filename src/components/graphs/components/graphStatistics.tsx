import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { GraphTable } from "./ui/graphTable";
import { useGraphInstanceMeteo } from "../useGraphInstancData";

export const GraphStatistics:  React.FC<GraphInstanceState> = props => {

    const { viewStatistics, isLoading } = useGraphInstanceMeteo( props.property.slug );

    if ( isLoading ) return <></>;

    return <GraphTable statisticsData={viewStatistics} property={props.property}/>

}