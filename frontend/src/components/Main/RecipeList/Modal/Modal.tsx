import {
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Text,
    Modal,
} from '@chakra-ui/react';

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Lorem</Text>
                    </ModalBody>

                    {/* <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button variant="ghost">
                            Secondary Action
                        </Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    );
};

export default RecipeModal;
