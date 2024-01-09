"use client";

import { GraphTools } from "@/state/graph/data/tools";
import { useGraphContext } from "@/state/graph/graphContext";
import { GraphActions, StackActions } from "@/state/graph/reducerInternals/actions";
import { useMeteoContext } from "@/state/meteo/meteoContext";
import { useScopeContext } from "@/state/scope/scopeContext";
import { Button, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { CloseIcon, ZoomInIcon } from "../ui/icons";

/** Run the tour */
export const GraphTour: React.FC = () => {

    const { graphState: state, graphDispatch } = useGraphContext();

    const { data: contentData, response, selection } = useMeteoContext();

    const { activeScope } = useScopeContext();

    const Tour = useMemo(() => dynamic(
        () => import("@reactour/tour").then(mod => mod.Tour),
        { ssr: false }
    ), []);

    const [tourOfferModalOpen, setTourOfferModalOpen] = useState(true);

    const onTourOfferClose = useCallback((shouldOpenTour: boolean) => {
        setTourOfferModalOpen(false);
        if (shouldOpenTour)
            graphDispatch(StackActions.setTourRunning(true))
    }, [setTourOfferModalOpen]);

    const closeTour = () => graphDispatch(StackActions.setTourRunning(false));
    const openTour = () => graphDispatch(StackActions.setTourRunning(true));

    const [disableActions, setDisableActions] = useState(false);

    const steps = useMemo(() => [
        {
            selector: '#graph0view',
            content: <>
                <p className="py-3">Grafy zobrazují údaje vždy po hodinách.</p>
                <p><strong>Přejíždějte myší</strong> pro prohlídku naměřených hodnot.</p>
            </>,
        },
        {
            selector: '.graph-selector',
            content: <>
                <p className="py-3">Můžete <strong>přepínat</strong> mezi různými veličinami.</p>
            </>,
        },
        {
            selector: '#graph0sizes',
            content: <>
                <p className="py-3"><strong>Velikost každého</strong> grafu můžete nastavit zde.</p>
            </>,
        },
        {
            selector: '#barSizing',
            content: <>
                <p className="py-3">Zde lze nastavit <strong>velikost všech grafů</strong> najednou.</p>
            </>,
        },
        {
            selector: '#filter',
            content: <>
                <p className="py-3"><strong>Změnte rozsah</strong> zobrazených dat.</p>
                <p>Aplikace zobrazuje údaje maximálně tři měsíce zpětně.</p>
            </>
        },
        {
            selector: '#selectTool',
            content: <>
                <p className="py-3">Zapněte nástroj <strong>Vyznačení oblasti</strong></p>
            </>,
            disableActions: true
        },
        {
            selector: '#graph0view',
            content: <>
                <p className="py-3">Nyní klikněte do grafu a vyznačte nějaký časový rozsah.</p>
            </>,
            disableActions: true
        },
        {
            selector: '#graph0statistics',
            content: <>
                <p className="py-3">Zde vidíte souhrn údajů z vyznačené oblasti.</p>
            </>,
            disableActions: false
        },
        {
            selector: "#barRange",
            content: <>
                <p className="py-3">Zde vidíte informace o vyznačeném <strong>rozsahu</strong>.</p>
                <p className="py-3">Pomocí tlačítka <Kbd>Přiblížit</Kbd> přiblížíte celé zobrazení na vyznačené časové období.</p>
                <p className="py-3">Pomocí tlačítka <Kbd>Zavřít</Kbd> vyznačení zrušíte.</p>
                <Button
                    color="primary"
                    onClick={() => {
                        graphDispatch(StackActions.setTourPassed(true));
                        graphDispatch(StackActions.setTourRunning(false));
                    }}
                >Ukončit průvodce</Button>
            </>
        }
    ], []);

    const currentStep = state.tourCurrentStep;
    const setCurrentStep = (step: number) => graphDispatch(StackActions.setTourCurrentStep(step));

    useEffect(() => {

        if (state.tourCurrentStep === 5) {
            if (state.activeTool === GraphTools.SELECT) {
                graphDispatch(StackActions.setTourCurrentStep(6));
            }
        }

    }, [state.activeTool, state.tourCurrentStep]);

    useEffect(() => {
        if (state.tourCurrentStep === 6) {
            if (selection.hasRange === true) {
                graphDispatch(StackActions.setTourCurrentStep(7));
            }
        }
    }, [state.tourCurrentStep, selection.hasRange]);

    const queriedProperties: {
        name: string, color: string, in: string
    }[] = useMemo(() => {
        if (response === undefined)
            return [];
        return response.range.data.map(property => ({
            name: property.name,
            color: property.color,
            in: property.in.name ?? property.in.slug
        }));
    }, [response?.range.data]);

    const queriedSources: {
        name: string, color: string, description: string, link?: string
    }[] = useMemo(() => {
        if (response === undefined)
            return [];
        return response.weatherRange.map(source => ({
            name: source.source.name,
            color: source.source.color,
            description: source.source.description,
            link: source.source.link
        }));
    }, [response?.weatherRange]);

    return <>

        {/** Modal offering the tour */}
        <Modal
            isOpen={tourOfferModalOpen}
            onOpenChange={onTourOfferClose}
            isDismissable={false}
            hideCloseButton={true}
        >
            <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className="flex flex-col gap-1">
                    {(activeScope !== undefined && queriedProperties.length !== 0 ) 
                    ? "Vítejte!"
                    : "Načítám"
                    }</ModalHeader>
                    <ModalBody>

                        {(activeScope === undefined || queriedProperties.length == 0) && <div className="py-10 text-center">
                            <Spinner />
                        </div>}

                        {queriedProperties.length > 0 && <>
                            <p>Tým <strong>{activeScope?.name}</strong> měří v lokalitě <strong>{activeScope?.locality}</strong>. Rozhodl se měřit následující údaje:</p>
                            <ul className="list-disc ml-5">
                                {queriedProperties.map(property => <li key={property.name}><span style={{ color: property.color }}>{property.name}</span></li>)}
                            </ul>
                            <p>Dále jsou k dispozici údaje z těchto zdrojů:</p>
                            <ul className="list-disc ml-5">
                                {queriedSources.map(source => <li key={source.name}>
                                    <span style={{ color: source.color }}>{source.name}</span>
                                    <br />
                                    {source.description}
                                    {source.link && <a href={source.link} target="_blank" rel="nofollow">info</a>}
                                </li>)}
                            </ul>
                        </>}
                    </ModalBody>
                    {queriedProperties.length > 0 &&
                        <ModalFooter>
                            {state.tourPassed === false
                                ? <>
                                    <Button
                                        onClick={() => onTourOfferClose(true)}
                                    >Začněte prohlídkou funkcí</Button>
                                </>
                                : <Button
                                    onClick={() => onTourOfferClose(false)}
                                >Prohlížet data</Button>
                            }

                        </ModalFooter>
                    }
                </>)}
            </ModalContent>

        </Modal>

        {/** Modal offering the tour */}
        {state.tourActive && <Tour
            onClickClose={closeTour}
            setIsOpen={openTour}
            disableInteraction={false}
            isOpen={state.tourActive}
            steps={steps}
            setCurrentStep={setCurrentStep as Dispatch<SetStateAction<number>>}
            currentStep={currentStep}
            disabledActions={disableActions}
            setDisabledActions={setDisableActions} />}
    </>

}