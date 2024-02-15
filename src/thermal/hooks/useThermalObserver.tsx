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

        if (renderingContainer.current === null)
            return;


        const observer = new MutationObserver((mutations) => {

            const getValueInt = (mutation: MutationRecord) => {

                const value = mutation.oldValue ? parseInt( mutation.oldValue ) : undefined;

                return value;

                // const value = parseInt(mutation.target.attributes[mutation.attributeName].value); // eslint-disable-line

                // return isNaN(value) ? undefined : value;
            };

            const getValueFloat = (mutation: MutationRecord) => {

                if (mutation.type !== "attributes")
                    return undefined;

                const value = mutation.oldValue ? parseFloat( mutation.oldValue ) : undefined;

                return value;
                // parseFloat(mutation.target.attributes[mutation.attributeName].value); // eslint-disable-line

                // return isNaN(value) ? undefined : value;
            };

            mutations.forEach(mutation => {


                if (mutation.type === "attributes") {

                    console.log( 
                        mutation.attributeName, 
                        mutation.type 
                    );

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

    }, [renderingContainer]);

    return {
        x,
        y,
        value
    }

}