import { useMutation } from '@apollo/client';
import {
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Modal,
    Input,
    Stack,
    Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import RecipeOperations from '../../../../graphql/operations/recipe';
import {
    CreateRecipeData,
    CreateRecipeInput,
} from '@/src/util/types';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';

interface RecipeModalProps {
    session: Session;
    isOpen: boolean;
    onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
    session,
    isOpen,
    onClose,
}) => {
    const router = useRouter();

    const {
        user: { id: userId },
    } = session;
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');

    const [createRecipe, { loading: createRecipeLoading }] =
        useMutation<CreateRecipeData, CreateRecipeInput>(
            RecipeOperations.Mutations.CREATE_RECIPE
        );

    const onCreateRecipe = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        try {
            const { data } = await createRecipe({
                variables: {
                    title: title,
                    instructions: instructions,
                    userId: userId,
                },
            });

            if (!data?.createRecipe) {
                throw new Error('Failed to add recipe');
            }

            const {
                createRecipe: { recipeId },
            } = data;

            router.push({ query: { recipeId } });

            /**
             * Clear state and close modal on successful creation
             */
            setTitle('');
            setInstructions('');
            onClose();
        } catch (error: any) {
            console.log('onCreateRecipe error', error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="700px" p={3} pb={5}>
                    <ModalHeader>Add recipe</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onCreateRecipe}>
                            <Stack spacing={4}>
                                <Input
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                />
                                <Textarea
                                    rows={10}
                                    placeholder="Instructions"
                                    value={instructions}
                                    onChange={(e) => {
                                        setInstructions(
                                            e.target.value
                                        );
                                    }}
                                />
                                <Button
                                    width="100%"
                                    type="submit"
                                    isLoading={createRecipeLoading}
                                    disabled={!title}
                                >
                                    Add recipe
                                </Button>
                            </Stack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RecipeModal;
