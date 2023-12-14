import { CloseIcon } from "@/components/ui/icons";
import { useGraphContext } from "@/state/useGraphStack/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { GraphSettingButton } from "./ui/graphSettingButton";

export const GraphRemoveButton: React.FC<GraphInstanceState> = props => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { stack } = useGraphContext();

    return <>

        <GraphSettingButton onClick={onOpen} active={false} tooltip={"Nastavení grafu"}>

            <CloseIcon />

        </GraphSettingButton>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Smazat graf</ModalHeader>
                        <ModalBody>

                            <p>Opravdu chcete odstranit graf {props.property.name}?</p>

                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup>
                                <Button color="primary" onPress={() => {
                                    stack.dispatch(StackActions.removeGraph(props.property.slug))
                                    onClose();
                                }}>
                                    Ano
                                </Button>
                                <Button
                                    variant="bordered"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Ne
                                </Button>

                            </ButtonGroup>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}