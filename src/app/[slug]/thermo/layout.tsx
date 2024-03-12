import { LrcHeader } from "@/thermal/components/layout/LrcHeader";
import { ThermalLayout } from "@/thermal/components/layout/ThermalLayout";

const LrcLayout: React.FC<React.PropsWithChildren> = props => {
    return <>
        <LrcHeader/>
        {props.children}
    </>
}

export default LrcLayout;