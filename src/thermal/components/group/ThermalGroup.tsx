"use client";

import { useThermoGroupLoader } from "@/thermal/hooks/useThermoGroupLoader";
import { useEffect, useMemo, useState } from "react";
import { ThermalInstance } from "../instance/ThermalInstance";
import { Slider, SliderValue, cn } from "@nextui-org/react";
import { useThermoGroupObserver } from "@/thermal/hooks/useThermoGroupObserver";
import { ThermalScale } from "./internals/ThermalScale";
import { useThermoContext } from "@/thermal/context/thermoContext";

type ThermalGroupProps = {
    name: string,
    urls: string[]
}

export const ThermalGroup: React.FC<ThermalGroupProps> = props => {

    const [loaded, setLoaded] = useState<boolean>(true);

    const {
        state: group,
        loadFiles,
        afterLoad
    } = useThermoGroupLoader(props.name);

    const { setRange } = useThermoGroupObserver(props.name);

    const { state: {min: globalMin, max: globalMax} } = useThermoContext();

    useEffect(() => {
        loadFiles(props.urls);
    }, [props.urls]);

    useEffect( () => {

        if ( loaded === false ) {

            if ( group !== undefined ) {
                const numberOfInstances = Object.values(group.instancesByPath).length;
                if ( 
                    props.urls.length !== numberOfInstances
                    && numberOfInstances > 0
                ) {
                    setLoaded( true );
                    if ( group.min !== undefined || group.max !== undefined ) {
                        setRange( {from: group.min, to: group.max} );
                    }
                }
            }

        }

    }, [props.urls, group, loaded] );

    if ( loaded === false ) return <></>

    return <div className="inline-block w-full md:w-1/2 lg:w-1/3 p-4">
        <div className="bg-gray-100 rounded-2xl p-4">

            {group && <div>

                <h1>{group.groupId}</h1>

                <ThermalScale 
                    label={"Teplota"}
                    onChange={(data:SliderValue) => {
                        if ( Array.isArray( data ) ) {
                            setRange( {from: data[0],to: data[1]} );
                        }
                    }}
                    min={globalMin ?? -1}
                    max={globalMax ?? 1}
                    from={group.from ?? 0}
                    to={group.to ?? 1}
                />

            </div>
        }


            <div className="flex w-full flex-wrap">
                    {group && Object.values(group.instancesByPath).map(instance => <ThermalInstance
                        key={instance.id}
                        file={instance}
                        originalSize={false}
                        containerClass={"w-full md:w-1/2 lg:w-1/3"}
                    />)}
            </div>

                

            
           </div> 

        </div>
        
}