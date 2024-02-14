"use client";

import { useLrcCanvas } from "@/utils/reader/useLrc";

import React, { useEffect, useRef, useMemo, useState } from "react";

import {
    P5CanvasInstance,
    SketchProps
} from "@p5-wrapper/react";

import { IRON } from "./palettes"

type LrcProps = {
    url: string
}

type MySketchProps = SketchProps & {
    rotation: number;
};

export const Lrc: React.FC<LrcProps> = props => {

    const parentRef = useRef<HTMLDivElement>(null);

    const { file, x, y, value, setContainer } = useLrcCanvas(props.url);

    const container = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if (file && parentRef.current) {

            setContainer(parentRef.current);

            return;

        }
    }, [file, parentRef.current, setContainer]);

    const downloadImage = (data: string, filename = 'testing.png') => {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return <div>
        <h1>LRC Reader</h1>
        <div>Signatura: {file?.signature}</div>
        <div>Čas: {file?.timestamp}</div>
        <div>Verze: {file?.toString()}</div>
        <div>W: {file?.width}</div>
        <div>H: {file?.height}</div>
        <div>Počet pixelů: {file?.pixels.length}</div>
        <div>Min: {file?.min}</div>
        <div>Max: {file?.max}</div>

        <div ref={parentRef} 
            style={{
                transform: "scale(3)",
                display: "inline-block",
                marginLeft: "400px"
            }}
        ></div>

        <div>CursorValue: {value}</div>
        {x && <div>X: {x}</div>}
        {y && <div>Y: {y}</div>}
        <button
            // href="image.png"
            onClick={() => {
                if (container.current) {
                    const image = container.current.toDataURL();
                    console.log(image);
                    downloadImage(image, "wtf.png")
                }
            }}
        >Stáhnout</button>
    </div>

}