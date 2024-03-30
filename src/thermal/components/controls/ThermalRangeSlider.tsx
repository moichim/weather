"use client";

import { InfoIcon, SettingIcon } from "@/components/ui/icons";
import { ThermalRegistry } from "@/thermal/registry/ThermalRegistry";
import { useThermalRegistryPaletteDrive } from "@/thermal/registry/properties/drives/palette/useThermalRegistryPaletteDrive";
import { useThermalRegistryRangeDrive } from "@/thermal/registry/properties/drives/range/useThermalRegistryRangeDrive";
import { useThermalRegistryHistogramState } from "@/thermal/registry/properties/states/histogram/useThermalRegistryHistogramState";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { useThermalRegistryMinmaxState } from "@/thermal/registry/properties/states/minmax/registry/useThermalRegistryMinmaxState";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider, SliderProps, SliderValue, Spinner, Tooltip, cn } from "@nextui-org/react";
import { DOMAttributes, useCallback, useEffect, useMemo, useState } from "react";

type ThermalRangeProps = SliderProps & {
    registry: ThermalRegistry,
    rangeOffset?: number,
    histogramBorder?: boolean
}

export const ThermalRangeSlider: React.FC<ThermalRangeProps> = ({
    registry,
    rangeOffset = 0,
    histogramBorder = true,
    ...props
}) => {

    const purpose = useMemo(() => {
        return `thermal_scale__${registry.id}__${Math.random()}`;
    }, []);




    // Global properties

    // Minmax
    const { value: minmax } = useThermalRegistryMinmaxState(registry, purpose);

    // Range
    const { value: range, set: setRange } = useThermalRegistryRangeDrive(registry, purpose);

    // Histogram
    const { value: histogram } = useThermalRegistryHistogramState(registry, purpose);

    // Palette
    const { availablePalettes, value: currentPaletteSlug, palette: currentPalette } = useThermalRegistryPaletteDrive(registry, purpose);

    // Loading
    const { value: loading } = useThermalRegistryLoadingState(registry, purpose);






    // Initial value calculation
    const initialValue = useMemo(() => {

        if (range !== undefined) {

            const normalisedValue = [
                Math.min(range.from, range.to),
                Math.max(range.from, range.to)
            ] as [number, number];


            return normalisedValue;

        }

        return [
            -Infinity,
            Infinity
        ] as [number, number]

    }, [range]);


    // Local state controlling the UI
    const [value, setValue] = useState<[number, number]>(initialValue);

    // Local state storing the final value
    const [final, setFinal] = useState<[number, number]>(value);



    const onUserSlide = (data: SliderValue) => {
        if (Array.isArray(data))
            setValue(data as [number, number]);
    }

    const onUserSlideEnd = (data: SliderValue) => {
        if (Array.isArray(data))
            setFinal(data as [number, number]);
    }



    // Impose the local change to global context
    useEffect(() => {

        if (range !== undefined) {
            if (range.from !== final[0] || range.to !== final[1]) {
                setRange({ from: final[0], to: final[1] });
            }
            if (final[0] !== value[0] || final[1] !== value[1]) {
                setValue(final);
            }
        }


    }, [final]);


    // Reflect global changes to the local state
    useEffect(() => {

        if (range !== undefined) {

            if (
                range.from !== final[0]
                || range.to !== final[1]
            ) {
                setFinal([range.from, range.to]);
                setValue([range.from, range.to]);
            }

        }

    }, [range]);




    // The render thumb fn
    /** @todo change colors of the points by the current palette */
    const renderThumb = useCallback((
        props: DOMAttributes<HTMLDivElement> & { index?: number }
    ) => {

        const bg = props.index === 0
            ? currentPalette.pixels[0]//"bg-black"
            : currentPalette.pixels[255]//"bg-white";
        return (<div
            {...props}
            className={"group p-1 top-1/2 bg-gray-700 border-tiny border-default-200 rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"}
            aria-label="some label"
        >
            <span className={"transition-transform rounded-full w-6 h-6 block group-data-[dragging=true]:scale-80"}
                style={{ backgroundColor: bg }}
            />
        </div>)
    }, [currentPalette]);




    const step = useMemo(() => {

        if (minmax === undefined)
            return -Infinity;

        return Math.round(minmax.max - minmax.min) / 50;

    }, [minmax]);


    const fillerClass = useMemo(() => {

        if (loading === false) {
            return `thermal-scale-${currentPaletteSlug} cursor-pointer`;
        }

        return "cursor-disabled";

    }, [loading, currentPaletteSlug]);




    /** Conditional rendering */

    // If loading
    if (minmax === undefined) {
        return <div className="flex-grow flex gap-4 items-center text-primary h-full">
            <Spinner size="sm" />
            <span>Zpracovávám teplotní škálu</span>
        </div>
    }




    return <div className="flex-grow">

        <style>

            {Object.entries(availablePalettes).map(([key, palette]) => {

                return `.thermal-scale-${key} {background-image: ${palette.gradient}}`

            })}

        </style>


        <div className="flex gap-4 w-full items-center">
            <div className="flex-grow">

                <div className="w-full h-10 px-4">
                    <div className={cn( histogramBorder && "border-1 border-solid border-gray-300"," relative w-full h-full" )}>


                        {(histogram === undefined) && <div className="flex gap-4 items-center text-primary justify-center h-full">
                            <Spinner size="sm" />
                            <span>Zpracovávám histogram</span>
                        </div>}
                        {(histogram) && histogram.map((item, index) => {

                            return <Tooltip
                                content={`${item.percentage.toFixed(4)}% teplot je v rozmezí ${item.from.toFixed(2)} °C až ${item.to.toFixed(2)} °C`}
                                placement="top"
                                color="foreground"
                                key={item.from.toString()}
                            ><div
                                className={cn( "absolute hover:bg-white bottom-0 h-full transition-all duration-300 ease-in-out", histogramBorder && "border-s-1 border-gray-300 border-solid first:border-s-0" )}
                                style={{
                                    width: `${100 / histogram.length}%`,
                                    left: `${index * (100 / histogram.length)}%`
                                }}
                            >
                                    <div
                                        className="w-full bg-primary-500 opacity-70 absolute bottom-0"
                                        style={{
                                            height: `${item.height}%`
                                        }}
                                    ></div>
                                </div>
                            </Tooltip>

                        })}
                    </div>
                </div>

                <Slider
                    {...props}

                    isDisabled={loading}

                    step={step}
                    showSteps={step !== -Infinity}

                    onChange={onUserSlide}
                    onChangeEnd={onUserSlideEnd}


                    // Values
                    minValue={Math.floor(minmax.min - rangeOffset)}
                    maxValue={Math.ceil(minmax.max + rangeOffset)}

                    value={value}


                    // Appearance
                    color="foreground"
                    classNames={{
                        base: "px-1 min-w-screen",
                        mark: "bg-black",
                        track: "bg-gray-400 h-6 cursor-pointer",
                        filler: fillerClass,
                        label: "text-xl"
                    }}


                    // aria-label={props.label ?? "teplotní škála"}
                    renderThumb={renderThumb}
                    renderLabel={({ children, ...properties }) => (
                        <label {...properties} className="text-lg flex gap-2 items-center" aria-label="teplotní škála">
                            {children}
                            <Tooltip
                                className="px-1.5 text-small text-default-600 rounded-small"
                                content={
                                    <div>Celkový rozsah <strong>{props.minValue} °C</strong> až <strong>{props.maxValue} °C</strong></div>
                                }
                                placement="right"
                            >
                                <span className="transition-opacity opacity-80 hover:opacity-100">
                                    <InfoIcon />
                                </span>
                            </Tooltip>
                        </label>
                    )}
                    showTooltip
                />

            </div>


            <Dropdown>
                <DropdownTrigger>
                    <Button
                        isIconOnly
                    >
                        <SettingIcon />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    onAction={key => {

                        if (key === "all") {
                            if (minmax)
                                setRange({ from: minmax.min, to: minmax.max });
                        } else if (key === "auto") {

                            if (histogram && minmax)
                                if (histogram.length > 0) {

                                    const { min, max } = histogram.reduce((state, current) => {

                                        if (current.height > 3) {

                                            if (state.min > current.height) {
                                                state.min = current.from;
                                            }

                                            if (state.max < current.height) {
                                                state.max = current.to;
                                            }

                                        }

                                        return state;
                                    }, { min: minmax.max, max: minmax.min });

                                    setRange({ from: min, to: max });

                                }

                        }
                    }}
                >
                    <DropdownItem
                        key="all"
                        className="bg-gray-200"
                    >
                        <div className="flex w-full items-center gap-4">
                            <div className="rotate-90 text-white bg-primary rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>

                            </div>
                            <div>
                                <div className="font-bold">Celý teplotní rozsah</div>
                                <div className="text-sm text-gray-500">Roztáhnout barevnou paletu na celkový teplotní rozsah.</div>
                            </div>
                        </div>
                    </DropdownItem>
                    <DropdownItem
                        key="auto"
                        className="bg-gray-200"
                    >

                        <div className="flex w-full items-center gap-4">
                            <div className="text-white bg-primary rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                                </svg>


                            </div>
                            <div>
                                <div className="font-bold">Automaticky</div>
                                <div className="text-sm text-gray-500">Nastavit barevnou paletu na oblast, v níže je nejvíce teplot.</div>
                            </div>
                        </div>

                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

        </div>

    </div>

}