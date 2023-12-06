import { useWeatherContext } from "@/state/weatherContext";
import { Badge, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { PropertyGraphModes, PropertyGraphWithStateType } from "../useGraph";
import { GraphSettingsButton } from "./graphSettingsButton";

export const GraphSettings: React.FC<PropertyGraphWithStateType> = props => {


    const content = useWeatherContext();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    if (content.weather.length === 0 || content.loading)
        return <></>;

    const isDefault = props.domain === PropertyGraphModes.RECOMMENDED;

    const setDefault = () => {
        props.setDomain( PropertyGraphModes.RECOMMENDED );
    }

    return <>

        {isDefault
            ? <GraphSettingsButton onOpen={onOpen} />
            : <Badge content="" color="secondary" placement="top-right">
                <GraphSettingsButton onOpen={onOpen} />
            </Badge>
        }

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{props.property.name}</ModalHeader>
                        <ModalBody>

                            <RadioGroup
                                label="Rozsah hodnot na ose Y"
                                onValueChange={ value => props.setDomain(value as PropertyGraphModes) }
                                value={props.domain}
                            >
                                <Radio value={PropertyGraphModes.RECOMMENDED} description="Doporučeno.">{props.property.min} - {props.property.max} {props.property.unit}</Radio>
                                <Radio value={PropertyGraphModes.MANUAL}>Ručně zadaný rozsah</Radio>
                                <Radio value={PropertyGraphModes.NONE} description="Rozsah se upraví dle nejvyšší a nejnižší zobrazené hodnoty.">Automaticky</Radio>
                            </RadioGroup>

                            {props.domain === PropertyGraphModes.MANUAL && <div className="flex w-full gap-3">
                                <Input 
                                    label="Minimální hodnota" 
                                    type="number"
                                    value={props.min?.toString()} 
                                    onValueChange={value => props.setMin(parseFloat( value ))}
                                />
                                <Input 
                                    label="Maximální hodnota" 
                                    type="number"
                                    value={props.max?.toString()} 
                                    onValueChange={value => props.setMax(parseFloat( value ))}
                                />
                            </div>
                            }

                        </ModalBody>
                        <ModalFooter>
                            {!isDefault && 
                                <Button 
                                    variant="bordered" 
                                    onClick={() => {
                                        setDefault();
                                        onClose();
                                    }}
                                >
                                    Obnovit výchozí nastavení
                                </Button>
                            }
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