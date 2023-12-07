import { ZoomInIcon } from "@/components/ui/icons";
import { UseGraphStackValues } from "./useGraphStack"

export enum GraphTools {
    INSPECT = "inspect",
    SELECT = "select",
    ZOOM = "zoom"
}

type GraphToolType = {
    name: string,
    slug: GraphTools,
    icon: React.FC,
    onActivate?: ( hook: UseGraphStackValues ) => {},
    onDeactivate?: ( hook: UseGraphStackValues ) => {}
}

export const graphTools: {
    [I in GraphTools]: GraphToolType
} = {
    [GraphTools.INSPECT]: {
        name: "Výběr",
        slug: GraphTools.INSPECT,
        icon: ZoomInIcon
    },
    [GraphTools.SELECT]: {
        name: "",
        slug: GraphTools.SELECT,
        icon: ZoomInIcon,
        onActivate: undefined,
        onDeactivate: undefined
    },
    [GraphTools.ZOOM]: {
        name: "",
        slug: GraphTools.ZOOM,
        icon: ZoomInIcon,
        onActivate: undefined,
        onDeactivate: undefined
    }
};