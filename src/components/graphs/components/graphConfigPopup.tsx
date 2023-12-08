import { GraphDomain, GraphInstanceState } from "@/state/useGraphStack/storage";
import { useWeatherContext } from "@/state/weatherContext";
import { Badge, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@nextui-org/react";
import { useGraphContext } from "@/state/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphSettingsButton } from "@/components/graphCommons/components/graphSettingsButton";

export const GraphConfigPopup: React.FC<GraphInstanceState> = props => {


    const content = useWeatherContext();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {stack} = useGraphContext();


    if (content.weather.length === 0 || content.loading)
        return <></>;

    const isDefault = props.domain === GraphDomain.DEFAULT;

    const setDefault = () => {
        stack.dispatch( StackActions.setInstanceDomain( props.property.slug, GraphDomain.DEFAULT ) );
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
                                onValueChange={ value => {
                                    stack.dispatch( StackActions.setInstanceDomain( props.property.slug, value as any ) );
                                }}
                                value={props.domain.toString()}
                            >
                                <Radio value={GraphDomain.DEFAULT.toString()} description="Doporučeno.">{props.property.min} - {props.property.max} {props.property.unit}</Radio>
                                <Radio value={GraphDomain.AUTO.toString()} description="Rozsah se upraví dle nejvyšší a nejnižší zobrazené hodnoty.">Automaticky</Radio>
                            </RadioGroup>

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