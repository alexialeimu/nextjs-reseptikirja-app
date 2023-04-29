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
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    CreateRecipeData,
    CreateRecipeInput,
    RecipeData,
} from '@/src/util/types';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import recipeQueryStrings from '../../../../graphql/operations/recipe';

interface RecipeModalProps {
    session: Session;
    recipe: RecipeData | null;
    isOpen: boolean;
    onClose: () => void;
    isEditRecipeMode: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
    session,
    isOpen,
    onClose,
    isEditRecipeMode,
    recipe,
}) => {
    const router = useRouter();

    const {
        user: { id: userId },
    } = session;

    const [recipeData, setRecipeData] = useState({
        title: '',
        instructions: '',
    });

    const [createRecipe, { loading: createRecipeLoading }] =
        useMutation<CreateRecipeData, CreateRecipeInput>(
            recipeQueryStrings.Mutations.CREATE_RECIPE
        );

    const submitRecipe = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        isEditRecipeMode ? onUpdateRecipe() : onCreateRecipe();
    };

    const onCreateRecipe = async () => {
        try {
            const { data } = await createRecipe({
                variables: {
                    title: recipeData.title,
                    instructions: recipeData.instructions,
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
            setRecipeData({ title: '', instructions: '' });
            onClose();
        } catch (error: any) {
            console.log('onCreateRecipe error', error);
            toast.error(error.message);
        }
    };

    const [updateRecipe] = useMutation<
        { updateRecipe: boolean },
        { recipeId: string; title: string }
    >(recipeQueryStrings.Mutations.UPDATE_RECIPE);

    const onUpdateRecipe = async () => {
        const title = recipeData?.title ?? '';
        const recipeId = recipe?.recipe.id ?? '';
        try {
            toast.promise(
                updateRecipe({
                    variables: {
                        recipeId,
                        title,
                    },
                }),
                {
                    loading: 'Updating recipe',
                    success: 'Recipe updated',
                    error: 'Failed to update recipe',
                }
            );
            setRecipeData({ title: '', instructions: '' });
            onClose();
        } catch (error) {
            console.log('onUpdateRecipe error', error);
        }
    };

    useEffect(() => {
        setRecipeData({
            title: recipe?.recipe.name ?? '',
            instructions: recipe?.recipe.instructions ?? '',
        });
    }, [recipe]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="700px" p={3} pb={5}>
                    <ModalHeader>
                        {isEditRecipeMode
                            ? 'Edit recipe'
                            : 'Add recipe'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={submitRecipe}>
                            <Stack spacing={4}>
                                <Input
                                    placeholder="Title"
                                    value={recipeData.title}
                                    onChange={(e) => {
                                        setRecipeData({
                                            ...recipeData,
                                            title: e.target.value,
                                        });
                                    }}
                                />
                                <Textarea
                                    rows={10}
                                    placeholder="Instructions"
                                    value={recipeData.instructions}
                                    onChange={(e) => {
                                        setRecipeData({
                                            ...recipeData,
                                            instructions:
                                                e.target.value,
                                        });
                                    }}
                                />
                                <Button
                                    width="100%"
                                    type="submit"
                                    isLoading={createRecipeLoading}
                                    disabled={!recipeData.title}
                                >
                                    {isEditRecipeMode
                                        ? 'Edit recipe'
                                        : 'Add recipe'}
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
