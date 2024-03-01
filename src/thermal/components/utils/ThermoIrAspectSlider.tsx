import { ThermoActionsFactory } from "@/thermal/context/reducerInternals/actions";
import { useThermoContext } from "@/thermal/context/thermoContext";
import { Slider } from "@nextui-org/react"
import { useEffect, useState } from "react";

export const ThermoIrAspectSlider: React.FC = props => {

    const [ value, setValue ] = useState<number>( 1 );

    const context = useThermoContext();

    useEffect(() => {

        if ( value !== context.state.irAspect ) {
            context.dispatch( ThermoActionsFactory.setIrAspect( value ) );
        }

    },[value]);

    return <Slider 
        label="IR / VISU"
        step={0.025}
        showSteps={true}
        showTooltip={true}
        minValue={0}
        maxValue={1}
        value={value}
        onChange={data => {
            console.log( "data", data );
            if ( ! Array.isArray( data ) )
                setValue(data)
        }}
        classNames={
            {
                base: "px-3"
            }
        }
    />
}