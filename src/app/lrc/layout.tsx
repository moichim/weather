import { ThermalLayout } from "@/thermal/components/layout/ThermalLayout";
import { RegistryContextProvider } from "@/thermal/context/RegistryContext"

const LrcLayout: React.FC<React.PropsWithChildren> = props => {
    return <ThermalLayout>
        {props.children}
    </ThermalLayout>
}

export default LrcLayout;