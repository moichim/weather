import { ThermalLayout } from "@/thermal/components/layout/ThermalLayout";

const LrcLayout: React.FC<React.PropsWithChildren> = props => {
    return <ThermalLayout>
        {props.children}
    </ThermalLayout>
}

export default LrcLayout;