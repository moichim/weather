"use client";

import { useEffect, useMemo, useRef } from "react";


export class ThermogramDummyDataFactory {

    public static generateRandomFloat(from: number, to: number): number {
        return (Math.random() * (to - from)) + from;
    }

    public static generateRandomInteger(from: number, to: number) {
        return Math.floor(ThermogramDummyDataFactory.generateRandomFloat(from, to));
    }

    public static generateDimensions(): { width: number, height: number } {
        return {
            width: ThermogramDummyDataFactory.generateRandomInteger(100, 400),
            height: ThermogramDummyDataFactory.generateRandomInteger(100, 400)
        }
    }

    public static generateImageData(
        width: number,
        height: number,
        min: number,
        max: number
    ): number[] {

        const pixels: number[] = [];

        for (let i = 0; i <= (width * height); i++) {
            pixels.push(ThermogramDummyDataFactory.generateRandomFloat(min, max));
        }

        return pixels;
    }

    public static generateRandomImage(dimensions: undefined | { width: number, height: number } = undefined) {
        const dims = dimensions ?? ThermogramDummyDataFactory.generateDimensions();
        return {
            ...dims,
            pixels: ThermogramDummyDataFactory.generateImageData(dims.width, dims.height, -10, 10)
        }
    }

}

type ThermogramPropsType = {
    width: number,
    height: number,
    pixels: number[]
}

function splitFloat(value: number): number[] {

    const buffer = new ArrayBuffer(4);  // 4 bajty pro 32bit float
    const floatView = new DataView(buffer);

    // Nastavte 32bit float hodnotu v DataView
    floatView.setFloat32(0, value, true);  // druhý parametr true značí little-endian pořadí bajtů

    // Přečtěte jednotlivé bajty a sestavte 3 části po 8 bitech
    const byte1 = floatView.getUint8(0);
    const byte2 = floatView.getUint8(1);
    const byte3 = floatView.getUint8(2);
    const byte4 = floatView.getUint8(3);

    return [byte1, byte2, byte3, byte4];


}

export const Thermogram: React.FC<ThermogramPropsType> = props => {

    const height = useMemo(() => Math.abs(Math.round(props.height)), [props.height]);

    const width = useMemo(() => Math.abs(Math.round(props.width)), [props.width]);

    const length = useMemo(() => props.pixels.length - 1, [props.pixels.length]);

    const isValid = useMemo(() => (width * height) !== length, [width, height, length]);

    const ref = useRef<HTMLCanvasElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {

        if (ref.current) {

            context.current = ref.current.getContext("2d");

            let ctx = context.current!; // Assigning to a temp variable

            const data = props.pixels;

            const imageData = ctx.createImageData(width, height);

            for (var i = 0; i < length; i++) {

                const [r, g, b, a] = splitFloat(data[i]);

                const offset = i * 4;

                imageData.data[offset] = r;
                imageData.data[offset + 1] = g;
                imageData.data[offset + 2] = b;
                imageData.data[offset + 3] = a;

            }

            ctx.putImageData(imageData, 0, 0);

        }

    }, [width, height, props.pixels, length]);

    return <canvas
        ref={ref}
        width={`${width}px`}
        height={`${height}px`}
        style={{ border: "1px solid red" }}
    ></canvas>

}