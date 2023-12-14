import { Filter } from "./filter/filter"
import { GraphStackSettings } from "./graphs/graphStackSettings"

export const SettingsBar: React.FC<React.PropsWithChildren> = props => {
    return <div className="w-full flex items-center gap-3">

        <Filter />

        <GraphStackSettings />

    </div>
}