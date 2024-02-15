"use client";

import ThermalActionsFactory from "@/thermal/context/reducerInternals/actions";
import { useThermalContext } from "@/thermal/context/thermalContext"
import { Input, Slider } from "@nextui-org/react";

export const ThermalGroupRange = () => {

    const context = useThermalContext();

    if ( !context.state.max || !context.state.min || !context.state.from || !context.state.to ) 
        return <></>;

    console.log( context.state );

    return <>

        <Slider 
            label="Teplotní škála"
            step={0.1}
            minValue={context.state.min}
            maxValue={context.state.max}
            // defaultValue={}
            value={[ context.state.from ?? 0, context.state.to ?? 0 ]}
            onChange={ value => {
                if ( Array.isArray( value ) )
                    context.dispatch( ThermalActionsFactory.setRange( value[0], value[1] ) );
            } }

        />

    </>

}