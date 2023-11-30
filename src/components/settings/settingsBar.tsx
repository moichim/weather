import { GraphGridSettings } from "./graphs/graphGridSettings"
import { Filter } from "./dates/filter"

export const SettingsBar: React.FC<React.PropsWithChildren> = props => {
    return <div className="w-full flex items-center gap-3">

        <Filter />

        <GraphGridSettings />

    </div>
}