import { useMutation } from '@apollo/client';
import {
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Modal,
    Text,
    Flex,
    ModalFooter,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { RecipeData } from '@/src/util/types';
import { useRouter } from 'next/router';
import recipeQueryStrings from '../../../../graphql/operations/recipe';

interface DeleteModalProps {
    recipe: RecipeData;
    isOpen: boolean;
    onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    recipe,
    isOpen,
    onClose,
}) => {
    const router = useRouter();

    const [deleteRecipe] = useMutation<
        { deleteRecipe: boolean },
        { recipeId: string }
    >(recipeQueryStrings.Mutations.DELETE_RECIPE);

    const onDeleteRecipe = async (recipeId: string) => {
        try {
            toast.promise(
                deleteRecipe({
                    variables: {
                        recipeId,
                    },
                    update: () => {
                        router.replace('');
                    },
                }),
                {
                    loading: 'Deleting recipe',
                    success: 'Recipe deleted',
                    error: 'Failed to delete recipe',
                }
            );
        } catch (error) {
            console.log('onDeleteRecipe error', error);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="700px" p={3} pb={5}>
                    <ModalHeader>Delete Recipe</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Are you sure you want to delete{' '}
                            {recipe.recipe.name}?
                        </Text>
                    </ModalBody>
                    <ModalFooter gap={4}>
                        <Button colorScheme="gray" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                onDeleteRecipe(recipe.recipe.id);
                            }}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DeleteModal;
