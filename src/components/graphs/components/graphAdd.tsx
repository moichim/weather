"use client";

import { useGraphContext } from "@/state/graphStackContext"
import { StackActions } from "@/state/useGraphStack/actions";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

export const GraphAdd: React.FC = () => {

    const { stack } = useGraphContext();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    if (stack.state.availableGraphs.length === 0)
        return <></>

    return <><div className="flex w-full gap-2 p-3 mt-10">
        <div className="w-1/6 flex items-end justify-start flex-col gap-3"></div>
        <div 
            className="w-2/3 border-1 border-gray-400 border-dashed rounded-xl flex items-center justify-center h-[20vh] hover:bg-gray-100 cursor-pointer ease-in-out transition-all duration-300 group"
            role="button"
            onClick={onOpen}
        >
            <div
                className="px-5 py-3 bg-default rounded-lg group-hover:bg-default-200 transition-all duration-300 ease-in-out"
            >Přidat graf</div>
        </div>
        <div className="w-1/3"></div>
    </div>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>

        <ModalContent>
        {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Přidat graf</ModalHeader>
                        <ModalBody>

                            {stack.state.availableGraphs.map( state => {
                                return <Button
                                    key={state.slug}
                                    onClick={() => {
                                        stack.dispatch( StackActions.addGraph( state.slug ) );
                                        onClose();
                                    }}
                                >{state.name}</Button>
                            } )}

                        </ModalBody>

                    </>
                )}
        </ModalContent>

    </Modal>
    </>

}