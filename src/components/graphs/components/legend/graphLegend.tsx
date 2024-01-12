import { GraphLegendCustom } from "./graphLegendCustom"
import { GraphLegendSources } from "./graphLegendSources"

export const GraphLegend: React.FC = () => {
    return <>
        <p>Zaznamenávané údaje:</p>
        <GraphLegendCustom />

        <p>Dále jsou v grafu k dispozici data z těchto zdrojů:</p>
        <GraphLegendSources />
    </>
}