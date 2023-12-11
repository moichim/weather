"use client"

import { useMemo } from "react";
import { Thermogram, ThermogramDummyDataFactory } from "./thermogram"
import TemperatureRenderer from "./temperatureRenderer";

export const Testing: React.FC = () => {

    const image = useMemo( () => ThermogramDummyDataFactory.generateRandomImage({width:400,height: 350}), [] );

    return <>
    <TemperatureRenderer min={0} max={10} temperatureData={image.pixels} height={image.width} width={image.width}/>
        <Thermogram {...image} />
    </>

}