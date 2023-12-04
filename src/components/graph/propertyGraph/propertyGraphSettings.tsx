import { useDisplayContext } from "@/state/displayContext";
import { useWeatherContext } from "@/state/weatherContext";
import { As, Badge, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { useMemo } from "react";
import { PropertyGraphModes, PropertyGraphWithStateType } from "./propertyGraph";

export const PropertyGraphSettings: React.FC<PropertyGraphWithStateType> = props => {

    const { grid: graph } = useDisplayContext();

    const content = useWeatherContext();

    const property = useMemo(() => {
        return graph.allProps[props.prop];
    }, [props.prop, graph.allProps]);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    if (content.weather.length === 0 || content.loading)
        return <></>;

    const isDefault = props.domain === PropertyGraphModes.RECOMMENDED;

    return <>
        <Button onPress={onOpen} isIconOnly variant="light">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{property.name}</ModalHeader>
                        <ModalBody>

                            {/*

                            {property.unit && <p>
                                {property.name} se uvádí v jednotce <strong>{property.unit}.</strong>
                            </p>}

                            {(property.min || property.max) && <p>
                                Doporučený rozsah na levé ose grafu je <strong> {property.min} - {property.max} {property.unit}</strong>.
                            </p>}

                            */}

                            

                            <RadioGroup
                                label="Rozsah hodnot na ose Y"
                                onValueChange={ value => props.setDomain(value as PropertyGraphModes) }
                                value={props.domain}
                            >
                                <Radio value={PropertyGraphModes.RECOMMENDED}>{property.min} - {property.max} {property.unit} (doporučeno)</Radio>
                                <Radio value={PropertyGraphModes.MANUAL}>Ručně zadaný rozsah</Radio>
                                <Radio value={PropertyGraphModes.NONE}>Automaticky dle hodnot</Radio>
                            </RadioGroup>

                            {props.domain === PropertyGraphModes.MANUAL && <div className="flex w-full gap-3">
                                <Input 
                                    label="Minimální hodnota" 
                                    value={props.min?.toString()} 
                                    onValueChange={value => props.setMin(parseFloat( value ))}
                                />
                                <Input 
                                    label="Maximální hodnota" 
                                    value={props.max?.toString()} 
                                    onValueChange={value => props.setMax(parseFloat( value ))}
                                />
                            </div>
                            }

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                OK
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}