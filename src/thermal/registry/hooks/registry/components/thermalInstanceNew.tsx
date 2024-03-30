"use client";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useThermalRegistryLoadingState } from "@/thermal/registry/properties/states/loading/useThermalRegistryLoadingState";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, cn } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SingleController } from "./controllers/singleController";
import { SingleInstanceDownloadButtons } from "./displays/detail/singleInstanceDownloadButtons";
import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting";

export type ThermalInstanceDisplayParameters = {
    hasPopup?: boolean,
    showDateOnHighlight?: boolean,
    syncTimeHighlight?: boolean,
    highlightColor?: string,
    highlightOnHover?: boolean,
    forceHighlight?: boolean
}

type ThermalInstanceProps = ThermalInstanceDisplayParameters & {
    instance: ThermalFileInstance,
    className?: string,
}

/** 
 * Displays an instance
 * 
 * Creates the DOM inside which the instance shall be rendered.
*/
export const ThermalInstanceNew: React.FC<ThermalInstanceProps> = ({
    className = "w-full xs:w-1/2 lg:w-1/3",
    instance,

    hasPopup = false,
    showDateOnHighlight = true,
    syncTimeHighlight = true,
    highlightColor = undefined,
    highlightOnHover = true,
    forceHighlight = false,

    ...props
}) => {

    const ID = useMemo(() => {
        return instance.id;
    }, []);

    const ref = useRef<HTMLDivElement>(null);


    // Mounting and unmounting
    useEffect(() => {

        if (ref.current) {
            instance.mountToDom(ref.current);
            instance.draw();
        }

        return () => instance.unmountFromDom();

    }, [instance]);


    // Propagate the current popup state
    useEffect(() => {

        if (hasPopup === true) {
            instance.setClickHandler();
            instance.setHoverCursor("hand");
        } else {
            instance.setHoverCursor("default");
            instance.setClickHandler();
        }

    }, [hasPopup,instance]);


    // Propagate date on highlight display
    useEffect(() => {

        if (showDateOnHighlight !== instance.showDateOnHighlight)
            instance.setShowDateOnHighlight(showDateOnHighlight);

    }, [showDateOnHighlight,instance]);

    // Propagate the time highlight synchronisation
    useEffect(() => {

        if (syncTimeHighlight !== instance.timeHighlightSync)
            instance.setTimeHiglightSync(syncTimeHighlight)

    }, [syncTimeHighlight,instance]);

    // Propagate the highlight color
    useEffect(() => {

        if (highlightColor !== instance.highlightColor)
            instance.setHighlightColor(highlightColor);

    }, [highlightColor,instance]);

    // Propagate the highlight on hover
    useEffect(() => {

        if (highlightOnHover !== instance.highlightOnHover)
            instance.setHighlightOnHover(highlightOnHover);

    }, [highlightOnHover,instance]);

    // Propagate the force highlight state
    useEffect(() => {

        if (forceHighlight !== instance.forceHighlight)
            instance.setForceHighlight(forceHighlight);

    }, [forceHighlight,instance]);


    // The popup open state
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    // Has popup propagation
    useEffect(() => {

        if (hasPopup === true) {
            instance.setClickHandler(() => {

                setPopupOpen(!popupOpen);

            });
        }

        return() => instance.setClickHandler();

    }, [hasPopup, popupOpen, setPopupOpen, instance]);



    return <>
        <div
            ref={ref}
            className={cn(className, "relative p-0 m-0")}
        ></div>
        <Modal
            isOpen={popupOpen}
            onOpenChange={setPopupOpen}
            size="xl"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {instance.group.id}: {TimeFormat.human(instance.timestamp)}
                        </ModalHeader>
                        <ModalBody>
                            <SingleController

                                thermalUrl={instance.url}
                                visibleUrl={instance.visibleUrl}

                                hasPopup={false}
                                showDateOnHighlight={false}
                                syncTimeHighlight={false}
                                highlightOnHover={false}

                                hasDownloadButtons={false}

                            />
                        </ModalBody>
                        <ModalFooter>
                            <SingleInstanceDownloadButtons
                                thermalUrl={instance.url}
                                visibleUrl={instance.visibleUrl}
                            />
                            <Button
                                onClick={onClose}
                                color="primary"
                            >Zavřít</Button>
                        </ModalFooter>

                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}