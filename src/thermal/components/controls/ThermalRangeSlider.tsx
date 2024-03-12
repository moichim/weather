import { InfoIcon } from "@/components/ui/icons";
import { Slider, SliderProps, Tooltip, cn } from "@nextui-org/react";
import { Input } from "postcss";
import { DOMAttributes, useCallback } from "react";

type ThermalRangeProps = SliderProps & {

}

export const ThermalRangeSlider: React.FC<ThermalRangeProps> = props => {


    const renderThumb = useCallback((
        props: DOMAttributes<HTMLDivElement> & { index?: number }
    ) => {

        const bg = props.index === 0
            ? "bg-black"
            : "bg-white";
        return (<div
            {...props}
            className={"group p-1 top-1/2 bg-gray-700 border-tiny border-default-200 rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"}
        >
            <span className={cn("transition-transform rounded-full w-6 h-6 block group-data-[dragging=true]:scale-80", bg)} />
        </div>)
    }, []);


    return <Slider
        {...props}
        renderThumb={renderThumb}
        renderLabel={({ children, ...properties }) => (
            <label {...properties} className="text-lg flex gap-2 items-center">
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

}