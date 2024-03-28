"use client";

import { TimeFormat } from "@/state/time/reducerInternals/timeUtils/formatting";
import { useRegistryContext } from "@/thermal/context/RegistryContext";
import { ThermalFileInstance } from "@/thermal/file/ThermalFileInstance";
import { useThermalRegistry } from "@/thermal/hooks/retrieval/useThermalRegistry";
import { useThermalGroup } from "@/thermal/hooks/retrieval/useThernalGroup";
import { InstanceDetailEmitted, InstanceDetailEmittedDetail, ThermalEvents } from "@/thermal/registry/events";
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, cn } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";

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

    const group = useThermalGroup("detail");

    const registry = useThermalRegistry();

    const [detail, setDetail] = useState<ThermalFileInstance | undefined>(undefined);

    const openDetail = useCallback((
        payload: InstanceDetailEmittedDetail
    ) => {

        setContent(payload);

        const instance = group.instantiateSource(registry.manager.sourcesByUrl[payload.url]);
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
                // if (!props.instance.binded) {

                    props.instance.buildDom(ref.current);

                // }

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

                                <div>{TimeFormat.humanDate(content.time)} {TimeFormat.humanTime(content.time)}</div>

                                <div className="text-sm text-gray-500">
                                    <div>Minimální teplota: {content.min} °C</div>
                                    <div>Maximální teplota: {content.max} °C</div>
                                </div>

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