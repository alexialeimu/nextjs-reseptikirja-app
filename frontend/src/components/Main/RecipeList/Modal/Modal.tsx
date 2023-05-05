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
    FormControl,
    FormLabel,
    FormHelperText,
    VStack,
    HStack,
    Text,
    Heading,
    VisuallyHidden,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    CreateRecipeData,
    CreateRecipeInput,
    RecipeData,
    RecipeState,
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

    const [numTextFields, setNumTextFields] = useState(1);

    const [recipeData, setRecipeData] = useState<RecipeState>({
        title: '',
        recipeMethod: [],
    });

    const [createRecipe, { loading: createRecipeLoading }] =
        useMutation<CreateRecipeData, CreateRecipeInput>(
            recipeQueryStrings.Mutations.CREATE_RECIPE
        );

    const [updateRecipe] = useMutation<
        { updateRecipe: boolean },
        { recipeId: string; title: string; recipeMethod: string[] }
    >(recipeQueryStrings.Mutations.UPDATE_RECIPE);

    const handleAddTextField = () => {
        setNumTextFields(numTextFields + 1);
    };

    const handleRemoveTextField = () => {
        setNumTextFields(numTextFields - 1);
    };

    const submitRecipe = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        isEditRecipeMode ? onUpdateRecipe() : onCreateRecipe();
    };

    const onCreateRecipe = async () => {
        const filteredMethod = recipeData.recipeMethod.filter(
            (n) => n !== null
        );

        try {
            const { data } = await createRecipe({
                variables: {
                    title: recipeData.title,
                    recipeMethod: filteredMethod,
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
            setRecipeData({ title: '', recipeMethod: [] });
            setNumTextFields(1);
            onClose();
        } catch (error: any) {
            console.log('onCreateRecipe error', error);
            toast.error(error.message);
        }
    };

    const onUpdateRecipe = async () => {
        const recipeId = recipe?.recipe.id ?? '';
        const title = recipeData?.title ?? '';
        try {
            toast.promise(
                updateRecipe({
                    variables: {
                        recipeId,
                        title,
                        recipeMethod: recipeData.recipeMethod,
                    },
                }),
                {
                    loading: 'Updating recipe',
                    success: 'Recipe updated',
                    error: 'Failed to update recipe',
                }
            );
            setRecipeData({ title: '', recipeMethod: [] });
            setNumTextFields(1);
            onClose();
        } catch (error) {
            console.log('onUpdateRecipe error', error);
        }
    };

    useEffect(() => {
        setRecipeData({
            title: recipe?.recipe.name ?? '',
            recipeMethod: recipe?.recipe.recipeMethod ?? [],
        });
    }, [recipe]);

    const handleTextareaChange = (e: any, i: number) => {
        let array = recipeData.recipeMethod.slice();
        array[i] = e.target.value;
        const newObj = { ...recipeData, recipeMethod: array };
        setRecipeData(newObj);
    };

    console.log('DATAAAA:', recipeData);

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
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        value={recipeData.title}
                                        onChange={(e) => {
                                            setRecipeData({
                                                ...recipeData,
                                                title: e.target.value,
                                            });
                                        }}
                                    ></Input>
                                </FormControl>

                                <fieldset>
                                    <legend>Method</legend>
                                    <VStack>
                                        {[
                                            ...Array(numTextFields),
                                        ].map((_, index) => (
                                            <FormControl key={index}>
                                                <FormLabel>
                                                    <VisuallyHidden>
                                                        Step{' '}
                                                        {index + 1}
                                                    </VisuallyHidden>
                                                </FormLabel>
                                                {index === 0 && (
                                                    <FormHelperText
                                                        mb={3}
                                                    >
                                                        Enter the
                                                        recipe method
                                                        step by step
                                                        (press + for
                                                        more fields).
                                                        Alternatively,
                                                        you can enter
                                                        the whole
                                                        method in one
                                                        text field.
                                                    </FormHelperText>
                                                )}
                                                <Textarea
                                                    key={index}
                                                    placeholder={`Step ${
                                                        index + 1
                                                    }`}
                                                    rows={3}
                                                    value={
                                                        recipeData
                                                            .recipeMethod[
                                                            index
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleTextareaChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                ></Textarea>
                                            </FormControl>
                                        ))}
                                        <HStack>
                                            <Button
                                                isDisabled={
                                                    numTextFields <= 1
                                                }
                                                onClick={
                                                    handleRemoveTextField
                                                }
                                            >
                                                -
                                            </Button>
                                            <Button
                                                onClick={
                                                    handleAddTextField
                                                }
                                            >
                                                +
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </fieldset>
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
