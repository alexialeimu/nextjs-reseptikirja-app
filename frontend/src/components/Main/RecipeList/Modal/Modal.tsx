import { useMutation } from '@apollo/client';
import {
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Modal,
    Stack,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Flex,
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
import InputElement from './FormElements/InputElement';
import TextareaElement from './FormElements/TextareaElement';
import RepeatableTextarea from './FormElements/RepeatableTextarea';
import TagInput from './FormElements/TagInput';

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

    const [methodFieldNum, setMethodFieldNum] = useState(1);

    const [recipeData, setRecipeData] = useState<RecipeState>({
        title: '',
        description: '',
        ingredients: '',
        recipeMethod: [],
        servings: 0,
        time: 0,
        link: '',
        categories: [],
    });

    const [createRecipe, { loading: createRecipeLoading }] =
        useMutation<CreateRecipeData, CreateRecipeInput>(
            recipeQueryStrings.Mutations.CREATE_RECIPE
        );

    const [updateRecipe] = useMutation<
        { updateRecipe: boolean },
        {
            recipeId: string;
            title: string;
            description: string;
            ingredients: string;
            recipeMethod: string[];
            servings: number;
            time: number;
            link: string;
            categories: string[];
        }
    >(recipeQueryStrings.Mutations.UPDATE_RECIPE);

    const clearRecipeData = () => {
        setRecipeData({
            title: '',
            description: '',
            ingredients: '',
            recipeMethod: [],
            servings: 0,
            time: 0,
            link: '',
            categories: [],
        });
        setMethodFieldNum(1);
    };

    const handleRecipeMethodChange = (e: any, i: number) => {
        let array = recipeData.recipeMethod.slice();
        array[i] = e.target.value;
        const newObj = { ...recipeData, recipeMethod: array };
        setRecipeData(newObj);
    };

    const handleServingChange = (value: any) => {
        const newValue = value > 0 ? parseInt(value) : 0;
        setRecipeData({
            ...recipeData,
            servings: newValue,
        });
    };

    const handleTimeChange = (value: any) => {
        const newValue = value > 0 ? parseInt(value) : 0;
        setRecipeData({
            ...recipeData,
            time: newValue,
        });
    };

    const submitRecipe = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        isEditRecipeMode ? onUpdateRecipe() : onCreateRecipe();
    };

    const capitilizeArrayStrings = (arr: string[]) => {
        return (
            arr.map((c) => c.charAt(0).toUpperCase() + c.slice(1)) ??
            []
        );
    };

    const onCreateRecipe = async () => {
        const filteredMethod = recipeData.recipeMethod.filter(
            (n) => n !== null
        );

        const capitilizedCategories = capitilizeArrayStrings(
            recipeData.categories
        );

        try {
            const { data } = await createRecipe({
                variables: {
                    title: recipeData.title,
                    description: recipeData.description,
                    ingredients: recipeData.ingredients,
                    recipeMethod: filteredMethod,
                    link: recipeData.link,
                    servings: recipeData.servings,
                    time: recipeData.time,
                    userId: userId,
                    categories: capitilizedCategories,
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
            clearRecipeData();
            onClose();
        } catch (error: any) {
            console.log('onCreateRecipe error', error);
            toast.error(error.message);
        }
    };

    const onUpdateRecipe = async () => {
        const recipeId = recipe?.recipe.id ?? '';
        const title = recipeData?.title ?? '';
        const description = recipeData?.description ?? '';
        const ingredients = recipeData?.ingredients ?? '';
        const link = recipeData.link ?? '';
        const servings = recipeData.servings ?? 0;
        const time = recipeData.time ?? 0;
        const filteredMethod = recipeData.recipeMethod.filter(
            (n) => n !== null && n !== ''
        );
        const capitilizedCategories = capitilizeArrayStrings(
            recipeData.categories
        );

        try {
            toast.promise(
                updateRecipe({
                    variables: {
                        recipeId,
                        title,
                        description,
                        ingredients,
                        recipeMethod: filteredMethod,
                        servings,
                        time,
                        link,
                        categories: capitilizedCategories,
                    },
                }),
                {
                    loading: 'Updating recipe',
                    success: 'Recipe updated',
                    error: 'Failed to update recipe',
                }
            );
            clearRecipeData();
            onClose();
        } catch (error) {
            console.log('onUpdateRecipe error', error);
        }
    };

    useEffect(() => {
        setRecipeData({
            title: recipe?.recipe.name ?? '',
            description: recipe?.recipe.description ?? '',
            ingredients: recipe?.recipe.ingredients ?? '',
            recipeMethod: recipe?.recipe.recipeMethod ?? [],
            servings: recipe?.recipe.servings ?? 0,
            time: recipe?.recipe.time ?? 0,
            link: recipe?.recipe.link ?? '',
            categories:
                recipe?.recipe.categories.map((c) => c.name) ?? [],
        });
    }, [recipe]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="700px" p={3} pb={5}>
                <ModalHeader>
                    {isEditRecipeMode ? 'Edit recipe' : 'Add recipe'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={submitRecipe}>
                        <Stack spacing={4}>
                            <InputElement
                                title="Title"
                                data={recipeData.title}
                                handleChange={(e) =>
                                    setRecipeData({
                                        ...recipeData,
                                        title: e.target.value,
                                    })
                                }
                                isRequired={true}
                            />

                            <TextareaElement
                                title="Description"
                                data={recipeData.description}
                                rows={3}
                                handleChange={(e) =>
                                    setRecipeData({
                                        ...recipeData,
                                        description: e.target.value,
                                    })
                                }
                            />

                            <TextareaElement
                                title="Ingredients"
                                data={recipeData.ingredients}
                                rows={5}
                                handleChange={(e) =>
                                    setRecipeData({
                                        ...recipeData,
                                        ingredients: e.target.value,
                                    })
                                }
                            />
                            <RepeatableTextarea
                                title="Method"
                                data={recipeData.recipeMethod}
                                textareaCount={methodFieldNum}
                                placeholderText="Step"
                                helpText="Enter the recipe method step by step
                                (press + for more fields).
                                Alternatively, you can enter the whole
                                method in one text field."
                                rows={3}
                                setTextareaCount={(a) =>
                                    setMethodFieldNum(a)
                                }
                                handleChange={(e, i) =>
                                    handleRecipeMethodChange(e, i)
                                }
                            />

                            <Flex gap={5}>
                                <FormControl>
                                    <FormLabel>Servings</FormLabel>
                                    <NumberInput
                                        defaultValue={0}
                                        min={0}
                                        max={200}
                                        value={recipeData.servings}
                                        onChange={(valueNumber) =>
                                            handleServingChange(
                                                valueNumber
                                            )
                                        }
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Time (min)</FormLabel>
                                    <NumberInput
                                        step={5}
                                        defaultValue={0}
                                        min={0}
                                        max={200}
                                        value={recipeData.time}
                                        onChange={(valueNumber) =>
                                            handleTimeChange(
                                                valueNumber
                                            )
                                        }
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                            </Flex>

                            <InputElement
                                title="Link"
                                data={recipeData.link}
                                handleChange={(e) =>
                                    setRecipeData({
                                        ...recipeData,
                                        link: e.target.value,
                                    })
                                }
                                isRequired={false}
                            />

                            <TagInput
                                title="Categories"
                                data={recipeData.categories}
                                helpText="Create new categories by separating them with a comma."
                                changeCategories={(newArr) => {
                                    setRecipeData({
                                        ...recipeData,
                                        categories: newArr,
                                    });
                                }}
                            />

                            <Button
                                width="100%"
                                type="submit"
                                isLoading={createRecipeLoading}
                                isDisabled={recipeData.title === ''}
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
    );
};

export default RecipeModal;
