"use client";

import { Navbar } from "@/components/navigation/utils/Navbar";
import { ThermalRangeInline } from "@/thermal/components/controls/ThermalRangeInline";
import { useRegistryListener } from "@/thermal/context/useRegistryListener";

const LrcLayout: React.FC<React.PropsWithChildren> = props => {

    const listener = useRegistryListener();
    
    return <>
        <Navbar 
            className="bg-slate-200"
            innerContent={listener.registry.range === undefined 
            ? "Načítám teplotní škálu"

            :<ThermalRangeInline 
                object={listener.registry} 
                imposeInitialRange={listener.registry.range}
                description="Klikněte na posuvník a změňte rozsah zobrazených teplot!"/>}
        />
        {props.children}
    </>
}

export default LrcLayout;