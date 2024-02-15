"use client";

import { RefObject, useEffect, useState } from "react";
import ThermalFile from "../reader/thermalFile";

/** Observe and control user interaction with the instance */
export const useThermalObserver = (
    instance: ThermalFile | undefined,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const [x, setX] = useState<number | undefined>();
    const [y, setY] = useState<number | undefined>();
    const [value, setValue] = useState<number | undefined>();


    useEffect(() => {

        if (renderingContainer.current === null || instance === undefined)
            return;


        const observer = new MutationObserver((mutations) => {

            const getValueInt = (mutation: MutationRecord) => {

                const element = document.getElementById(  `thermal_image_${instance.id}` );

                if ( element !== null ) {
                    const rawValue = element.getAttribute( mutation.attributeName! );
                    if ( rawValue )
                    return parseInt( rawValue );
                }

                return undefined;

            };

            const getValueFloat = (mutation: MutationRecord) => {

                const element = document.getElementById(  `thermal_image_${instance.id}` );

                if ( element !== null ) {
                    const rawValue = element.getAttribute( mutation.attributeName! );
                    if ( rawValue )
                    return parseFloat( rawValue );
                }

                return undefined;
            };

            mutations.forEach(mutation => {


                if (mutation.type === "attributes") {

                    if (mutation.attributeName === "data-x") {

                        const value = getValueInt(mutation);
                        setX(value);

                    }

                    if (mutation.attributeName === "data-y") {

                        const value = getValueInt(mutation);
                        setY(value);

                    }

                    if (mutation.attributeName === "data-value") {

                        const value = getValueFloat(mutation);
                        setValue(value);

                    }

                }

            });



        });

        if (renderingContainer.current) {
            observer.observe(renderingContainer.current, { attributes: true });
        }

        return () => observer.disconnect();

    }, [renderingContainer, instance]);

    return {
        x,
        y,
        value
    }

}