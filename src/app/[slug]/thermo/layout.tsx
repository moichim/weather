"use client";

import { Navbar } from "@/components/navigation/utils/Navbar";
import { ThermalRange } from "@/thermal/components/controls/ThermalRange";
import { ThermalRangeInline } from "@/thermal/components/controls/ThermalRangeInline";
import { ThermalHeader } from "@/thermal/components/layout/ThermalHeader";
import { useRegistryListener } from "@/thermal/context/useRegistryListener";

const LrcLayout: React.FC<React.PropsWithChildren> = props => {

    const listener = useRegistryListener();
    
    return <>
        <Navbar 
            className="bg-slate-200"
            content={
                listener.registry.range !== undefined 
                    ? <ThermalRangeInline 
                        object={listener.registry} 
                        imposeInitialRange={listener.registry.range}
                        description="Klikněte na posuvník a změňte rozsah zobrazených teplot!"/>
                    : <strong>Načítám teplotní škálu</strong>
            }
        />
        {props.children}
    </>
}

export default LrcLayout;