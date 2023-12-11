"use client"

import { useMemo } from "react";
import { Thermogram, ThermogramDummyDataFactory } from "./thermogram"
import TemperatureRenderer from "./temperatureRenderer";

export const Testing: React.FC = () => {

    const image = useMemo( () => ThermogramDummyDataFactory.generateRandomImage({width:400,height: 350}), [] );

    return <>
        <TemperatureRenderer min={-20} max={20} imageUrl="https://irt.zcu.cz/wp-content/uploads/2021/08/DSC01951-1024x683.jpg" height={480} width={640}/>
    </>

}