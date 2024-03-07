import { Slider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRegistryListener } from "../../context/useRegistryListener";

export const OpacityScale: React.FC = props => {

    const [ value, setValue ] = useState<number>( 1 );

    const listener = useRegistryListener();

    useEffect(() => {

        if ( value !== listener.opacity ) {
            listener.setOpacity( value );
        }

    },[value]);

    return <Slider 
        label="IR / Visible"
        step={0.1}
        showSteps={true}
        showTooltip={true}
        minValue={0}
        maxValue={1}
        value={value}
        onChange={data => {
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