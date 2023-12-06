import { cn } from "@nextui-org/react";
import { GraphChart } from "../graphCommons/components/graphChart";
import { GraphHeader } from "../graphCommons/components/graphHeader";
import { GraphSettings } from "../graphCommons/components/graphSettings";
import { PropertyGraphPropsType, useGraphInstance } from "../graphCommons/useGraph";

export const GraphStackInstance: React.FC<PropertyGraphPropsType & {
    index: number
}> = props => {

    const graph = useGraphInstance(props.prop);

    const bgClass = props.index % 2 === 0 ? "bg-white" : "bg-gray-100";

    return <div className={cn("flex w-full gap-2 p-3")}>

        <div className="w-1/6 flex items-end justify-start flex-col gap-3 py-5">
            <GraphHeader prop={props.prop} {...graph} />
            <GraphSettings prop={props.prop} {...graph} />
        </div>
        <div className="w-2/3">
            <GraphChart prop={props.prop} {...graph} />
        </div>
        <div className="w-1/3">
            Tabulka
        </div>
    </div>

}