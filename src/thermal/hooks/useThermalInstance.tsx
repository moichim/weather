"use client";

import ThermalFile from "@/thermal/reader/thermalFile";
import { RefObject, useCallback, useEffect, useState } from "react";
import { useThermalLoader } from "./useThermalLoader";
import { useThermalObserver } from "./useThermalObserver";

/** handles the entire thermal file instance */
export const useThermalInstance = (
    url: string,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const file = useThermalLoader( url, renderingContainer );

    const observer = useThermalObserver( file, renderingContainer );

    return {
        file,
        observer
    }

}

export type ThermalInstanceHook = ReturnType<typeof useThermalInstance>;