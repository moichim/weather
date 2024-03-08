"use query";

import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance"
import { useCallback, useEffect, useRef, useState } from "react";
import { ThermalCanvasContainer } from "./ThermalContainer";
import { InstanceDetailEmitted, InstanceDetailEmittedDetail, ThermalEvents, ThermalEventsFactory } from "@/thermal/registry/events";
import { Button, Code, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, SliderValue, Tab, Tabs, cn } from "@nextui-org/react";
import { useGroupInstance } from "@/thermal/context/useGroupInstance";
import { useRegistryContext } from "@/thermal/context/RegistryContext";
import { ThermalScale } from "../registry/ThermalScale";
import { ThermalScaleGlobal } from "../registry/ThermalScaleGlobal";
import { useRegistryListener } from "@/thermal/context/useRegistryListener";

type ThermalInstanceProps = {
    instance: ThermalFileInstance,
    className?: string
}

/** 
 * Displays an instance
 * 
 * Creates the DOM inside which the instance shall be rendered.
*/
export const ThermalInstance: React.FC<ThermalInstanceProps> = ({
    className = "w-full xs:w-1/2 lg:w-1/3",
    ...props
}) => {

    const ref = useRef<HTMLDivElement>(null);

    const [content, setContent] = useState<InstanceDetailEmittedDetail | undefined>(undefined);

    const group = useGroupInstance("detail");

    const registry = useRegistryContext();

    const [detail, setDetail] = useState<ThermalFileInstance | undefined>(undefined);

    const openDetail = useCallback((
        payload: InstanceDetailEmittedDetail
    ) => {

        setContent(payload);

        const instance = group.instantiateSource(registry.sourcesByUrl[payload.url]);
        if (registry.range)
            instance.recieveRange(registry.range);

        setDetail(instance);

    }, [group, detail]);

    const closeDetail = useCallback(() => {
        setContent(undefined);
        if (detail) {
            group.removeInstance(detail.url);
        }
    }, [group, detail]);


    useEffect(() => {

        if (ref !== null) {
            if (ref.current) {
                if (!props.instance.binded) {

                    props.instance.buildDom(ref.current);

                }

            }
        }

    }, [props.instance, ref]);

    useEffect(() => {

        const listener = (event: Event): void => {

            const e = event as InstanceDetailEmitted;
            openDetail(e.detail);

        };

        props.instance.addEventListener(ThermalEvents.INSTANCE_DETAIL_EMITTED, listener);

        return () => props.instance.removeEventListener(ThermalEvents.INSTANCE_DETAIL_EMITTED, listener);

    }, []);

    useEffect(() => {
        if (detail) {
            detail.recieveActivationStatus(true);
            detail.emitsDetail = false;
        }
    }, [detail]);

    return <>
        <div
            ref={ref}
            className={cn(className, "relative p-0 m-0")}
        ></div>
        <Modal
            isOpen={content !== undefined}
            onOpenChange={() => {
                closeDetail();
            }}
            size="3xl"
        >
            <ModalContent>
                {(onClose) => {
                    if (content === undefined) return <></>;
                    else
                        return <>
                            <ModalHeader>
                                {content.filename}
                            </ModalHeader>
                            <ModalBody>

                                <div className="text-sm text-gray-500">
                                    <div>Minimální teplota: {content.min} °C</div>
                                    <div>Maximální teplota: {content.max} °C</div>
                                </div>

                                <h2>URL adresy</h2>

                                {detail && <>
                                    <ThermalInstance
                                        instance={detail}
                                        className="w-full"
                                    />
                                </>}

                            </ModalBody>
                            <ModalFooter>
                                <Button href={content.url} as={Link}>Stáhnout LRC</Button>
                                <Button href={content.visibleUrl} as={Link} target="_blank">Stáhnout obrázek</Button>
                                <Button onClick={onClose} color="primary">Zavřít</Button>
                            </ModalFooter>

                        </>
                }}
            </ModalContent>
        </Modal>
    </>
}