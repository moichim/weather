"use client";

import { useThermoGroupLoader } from "@/thermal/hooks/useThermoGroupLoader";
import { useEffect } from "react";
import { ThermalInstance } from "../instance/ThermalInstance";
import { Slider, cn } from "@nextui-org/react";
import { useThermoGroupObserver } from "@/thermal/hooks/useThermoGroupObserver";

type ThermalGroupProps = {
    name: string,
    urls: string[]
}

export const ThermalGroup: React.FC<ThermalGroupProps> = props => {

    const {
        state,
        loadFiles,
    } = useThermoGroupLoader(props.name);

    const { setRange } = useThermoGroupObserver(props.name);

    useEffect(() => {
        loadFiles(props.urls);
    }, [props.urls]);


    return <div className="inline-block w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="bg-gray-100 rounded-2xl p-4">

            {state && <div>

                <h1>{state.groupId}</h1>

                <Slider
                    label="Teplotní škála"
                    step={1}
                    minValue={Math.floor(state.min ?? 0)}
                    maxValue={Math.ceil(state.max ?? 0)}
                    defaultValue={[state.min ?? -1,state.max ?? 1]}
                    // value={[state.from ?? -3, state.to ?? 3]}
                    showTooltip={true}
                    showSteps={true}
                    onChange={(data) => {
                        console.log( data );
                        if (Array.isArray(data)) {
                            setRange({ from: data[0], to: data[1] });
                        }
                    }}
                    color="foreground"
                    classNames={{
                        filler: "wtf",
                        mark: "bg-black",
                        track: "bg-gray-400 h-6"
                    }}
                    renderThumb={(props) => {

                        const bg = props.index === 0
                            ? "bg-black"
                            : "bg-white";
                        return (<div
                            {...props}
                            className={"group p-1 top-1/2 bg-gray-700 border-tiny border-default-200 rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"}
                        >
                            <span className={cn("transition-transform rounded-full w-6 h-6 block group-data-[dragging=true]:scale-80", bg)} />
                        </div>)
                    }}
                />

            </div>
        }


            <div className="flex w-full flex-wrap">
                    {state && Object.values(state.instancesByPath).map(instance => <ThermalInstance
                        key={instance.id}
                        file={instance}
                        originalSize={false}
                        containerClass={"w-full md:w-1/2 lg:w-1/3"}
                    />)}
            </div>

                <style>
                    {`.wtf {background-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(10,12,77,1) 30%, rgba(86,20,101,1) 49%, rgba(255,0,0,1) 64%, rgba(249,255,0,1) 84%, rgba(255,255,255,1) 100%)}`}
                </style>

            
           </div> 

        </div>
        
}