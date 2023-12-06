import { useDisplayContext } from "@/state/displayContext"
import { PropertyGraph } from "./propertyGraph/propertyGraph";

export const Graphs: React.FC = () => {

    const setting = useDisplayContext();

    return <div>

        {setting.grid.activeProps.map( prop => <PropertyGraph key={prop} prop={prop} /> )}

    </div>

}