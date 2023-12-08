import { SelectIcon, ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { UseGraphStackValues } from "./useGraphStack"

export enum GraphTools {
    INSPECT = "inspect",
    SELECT = "select",
    ZOOM = "zoom"
}

export type GraphToolType = {
    name: string,
    tooltip: string,
    slug: GraphTools,
    icon: React.FC,
    onActivate?: ( hook: UseGraphStackValues ) => {},
    onDeactivate?: ( hook: UseGraphStackValues ) => {}
}

export const graphTools: {
    [I in GraphTools]: GraphToolType
} = {
    [GraphTools.INSPECT]: {
        name: "Inspekce",
        tooltip: "Prohlížejte jednotlivé hodnoty",
        slug: GraphTools.INSPECT,
        icon: ZoomOutIcon
    },
    [GraphTools.SELECT]: {
        name: "Vyznačení",
        tooltip: "Vyznačte oblast pro zobrazení statistik",
        slug: GraphTools.SELECT,
        icon: SelectIcon,
        onActivate: undefined,
        onDeactivate: undefined
    },
    [GraphTools.ZOOM]: {
        name: "Přiblížení",
        tooltip: "Přibližte oblast",
        slug: GraphTools.ZOOM,
        icon: ZoomInIcon,
        onActivate: undefined,
        onDeactivate: undefined
    }
};