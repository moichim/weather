"use client";

import { useLrc } from "@/utils/reader/useLrc";

import React, { useEffect, useRef, useMemo, useState } from "react";

import {
    P5CanvasInstance,
    SketchProps
} from "@p5-wrapper/react";

import {IRON} from "./palettes"

type LrcProps = {
    url: string
}

type MySketchProps = SketchProps & {
    rotation: number;
};

export const Lrc: React.FC<LrcProps> = props => {

    const file = useLrc(props.url);

    const container = useRef<HTMLCanvasElement>(null);

    const [cursor, setCursor] = useState<number|undefined>(undefined);
    const [coords, setCoords] = useState<[number,number]|undefined>(undefined);

    useEffect(() => {
        if (file && container.current) {

            const canvas = container.current;
            const context = canvas.getContext('2d');

            // Drawing
            if (context) {

                const drawPixel = (
                    x: number,
                    y: number,
                    mappedTemperature: number,
                    palette: string[]
                ) => {
                    context.fillStyle = palette[mappedTemperature];
                    context.fillRect( x, y, 1, 1 );
                }

                const range = file.max - file.min;

                for (let x = 0; x <= file.width; x++) {

                    for (let y = 0; y <= file.height; y++) {

                        const index = x + (y * file.width);
                        const temperature = file.pixels[index];

                        const temperatureRelative = temperature - file.min;
                        const temperatureAspect = temperatureRelative / range;
                        const color = Math.round(255 * temperatureAspect);

                        drawPixel(x,y,color, IRON);


                    }

                }

            }

            // Hover
            container.current.onmousemove = ( (event:MouseEvent) => {

                const x = event.layerX!;
                const y = event.layerY!;
                const index = x + ( y * file.width );

                setCursor( file.pixels[index] );
                setCoords( [x,y] );

                console.log( event );
            } );

            container.current.onmouseleave = () => {
                setCursor(undefined);
                setCoords(undefined);
            }

        }
    }, [file, container.current]);

    const downloadImage = (data: string, filename = 'testing.png') => {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild( a );
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
        {file &&
            <canvas ref={container} width={file.width} height={file.height} style={{
                transform:"scale(3)", 
                marginLeft:"400px", 
                // border:"2px solid yellow", 
                // backgroundColor: "green"
                cursor:"crosshair"
            }}/>
        }

<div>Cursor: {cursor}</div>
        {coords &&<>
            <div>X: {coords[0]}</div>
            <div>Y: {coords[1]}</div>
        </>}
        <button
            // href="image.png"
            onClick={() => {
                if (container.current) {
                    const image = container.current.toDataURL();
                    console.log( image );
                    downloadImage(image,"wtf.png")
                }
            }}
        >Stáhnout</button>
    </div>

}