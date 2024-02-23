"use client";

import { ThermalFileInstance, UserInteractionEvent } from "@/thermal/reader/ThermalFileInstance";
import { RefObject, useEffect, useState } from "react";
import { useThermoGroupObserver } from "./useThermoGroupObserver";

export const useThermoInstanceObserver = (
    instance: ThermalFileInstance,
    renderingContainer: RefObject<HTMLDivElement>
) => {

    const [value, setValue] = useState<number | undefined>();
    const [hover, setHover] = useState<boolean>(false);

    const { state, setCursor } = useThermoGroupObserver(instance.groupId);

    useEffect(() => {

        // Do nothing when the reference is not set
        if (renderingContainer.current === null)
            return;

        const container = renderingContainer.current;

        // If the instance is not binded yet, do so!
        if (container.dataset.binded === undefined) {
            instance.bind(container);
            instance.initialise();
        }

    }, [renderingContainer]);

    useEffect(() => {

        const onUserInteract = (e: Event) => {

            const event = e as UserInteractionEvent

            if (event.target.cursorX !== undefined || event.target.cursorY) {

                // Update the global cursor
                if (state.cursorX !== event.target.cursorX || state.cursorY !== event.target.cursorY) {
                    if (event.target.cursorX !== undefined && event.target.cursorY !== undefined) {
                        setCursor({ x: event.target.cursorX, y: event.target.cursorY });
                    } else {
                        setCursor({ x: undefined, y: undefined });
                    }
                }

            } else {
                setCursor({ x: undefined, y: undefined });
            }



        }

        instance.addEventListener("userinteraction", onUserInteract);


        return () => {
            instance.removeEventListener("userinteraction", onUserInteract);
        }

    }, [instance]);

    return {
        x: state.cursorX,
        y: state.cursorY,
        value,
        hover
    }

}

export type UseThermoInstanceType = ReturnType<typeof useThermoInstanceObserver>;