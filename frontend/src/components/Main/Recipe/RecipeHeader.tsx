import { useMutation, useQuery } from '@apollo/client';
import {
    Button,
    Flex,
    Heading,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData, RecipesData } from '@/src/util/types';
import { AiOutlineEdit } from 'react-icons/ai';
import toast from 'react-hot-toast';
import RecipeModal from '../RecipeList/Modal/Modal';
import { Session } from 'next-auth';

interface RecipeHeaderProps {
    // recipeId: string | string[];
    session: Session;
    recipeData: RecipeData | undefined;
    recipeLoading: boolean;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    session,
    recipeData,
    recipeLoading,
}) => {
    const headingColor = useColorModeValue(
        'heading.light',
        'heading.dark'
    );
    const leadParagraphColor = useColorModeValue(
        'leadParagraph.dark',
        'leadParagraph.light'
    );

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

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
        <Stack
            direction="column"
            py={2}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
            pb={5}
            mb={5}
        >
            <Button
                display={{ md: 'none' }}
                onClick={() =>
                    router.replace('?recipeId', '/', {
                        shallow: true,
                    })
                }
                mb={2}
            >
                Back
            </Button>
            {!recipeData && !recipeLoading && (
                <Text>Recipe Not Found</Text>
            )}
            {recipeData && (
                <Stack direction="column">
                    <RecipeModal
                        session={session}
                        recipe={recipeData}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        isEditRecipeMode={true}
                    />
                    <Flex justifyContent="space-between">
                        <Heading
                            as="h1"
                            textStyle="h1"
                            color={headingColor}
                        >
                            {recipeData &&
                                !recipeLoading &&
                                `${recipeData.recipe.name}`}
                        </Heading>

                        <Menu>
                            <MenuButton
                                width="min-content"
                                as={IconButton}
                                aria-label="Options"
                                icon={<AiOutlineEdit />}
                                variant="outline"
                            ></MenuButton>
                            <MenuList>
                                <MenuItem
                                    onClick={(event) => {
                                        setIsOpen(true);
                                    }}
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={(event) => {
                                        onDeleteRecipe(
                                            recipeData.recipe.id
                                        );
                                    }}
                                >
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    {recipeData && !recipeLoading && (
                        <Text
                            width={{ base: '100%', lg: '70%' }}
                            textStyle="leadParagraph"
                            color={leadParagraphColor}
                        >
                            {recipeData?.recipe.description}
                        </Text>
                    )}
                    <Flex
                        pt={5}
                        flexDirection={{
                            base: 'column',
                            md: 'row',
                        }}
                        alignItems={'flex-start'}
                        gap={3}
                    >
                        {recipeData && !recipeLoading && (
                            <Text
                                color={headingColor}
                                fontSize="sm"
                                textTransform={'uppercase'}
                            >
                                Added by{' '}
                                {recipeData.recipe.user?.username}
                            </Text>
                        )}

                        {recipeData &&
                            !recipeLoading &&
                            recipeData.recipe.link && (
                                <>
                                    <Text
                                        display={{
                                            base: 'none',
                                            md: 'block',
                                        }}
                                    >
                                        &#x2022;
                                    </Text>

                                    <Flex>
                                        <Text
                                            as="span"
                                            fontSize="sm"
                                            mr={1}
                                        >
                                            Source:
                                        </Text>
                                        <Link
                                            fontSize="sm"
                                            href={
                                                recipeData.recipe.link
                                            }
                                        >
                                            {recipeData.recipe.link}
                                        </Link>
                                    </Flex>
                                </>
                            )}
                    </Flex>
                </Stack>
            )}
        </Stack>
    );
};
export default RecipeHeader;
