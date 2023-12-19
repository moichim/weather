import { RangeDisplay } from "../../../../components/graphs/rangeDisplay"
import { Filter } from "../../../meteo/components/filter/filter"
import { GraphSizesButtonGroup } from "../graphSizesButtonGroup"

export const BarPanel: React.FC<React.PropsWithChildren> = props => {

    return <div className="w-full flex items-center gap-3">

        <Filter />

        <GraphSizesButtonGroup />

        <RangeDisplay />

    </div>
    
}