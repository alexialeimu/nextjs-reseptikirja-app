import { useMutation } from '@apollo/client';
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
    Input,
    Stack,
} from '@chakra-ui/react';
import { log } from 'console';
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
    const [createRecipe, { loading: createRecipeLoading }] =
        useMutation<CreateRecipeData, CreateRecipeInput>(
            RecipeOperations.Mutations.createRecipe
        );

    const onCreateRecipe = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        try {
            const { data } = await createRecipe({
                variables: {
                    title: title,
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
            onClose();

            console.log('HERE IS DATA', data);
        } catch (error: any) {
            console.log('onCreateRecipe error', error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add recipe</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onCreateRecipe}>
                            <Stack spacing={4}>
                                <Input
                                    placeholder="Title"
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                    value={title}
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
