"use client"

import { useMemo } from "react";
import { Thermogram, ThermogramDummyDataFactory } from "./thermogram"

export const Testing: React.FC = () => {

    const image = useMemo( () => ThermogramDummyDataFactory.generateRandomImage({width:400,height: 350}), [] );

    return <Thermogram {...image} />
}