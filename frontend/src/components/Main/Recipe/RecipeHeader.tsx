import { useMutation, useQuery } from '@apollo/client';
import {
    Button,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData, RecipesData } from '@/src/util/types';
import { RxHamburgerMenu } from 'react-icons/rx';
import toast from 'react-hot-toast';

interface RecipeHeaderProps {
    // recipeId: string | string[];
    recipeData: RecipeData | undefined;
    recipeLoading: boolean;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    recipeData,
    recipeLoading,
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
        <Stack
            direction="column"
            py={2}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
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
                    <Flex justifyContent="space-between">
                        <Heading as="h1" size={'xl'} fontWeight={600}>
                            {recipeData.recipe.name}
                        </Heading>
                        <Menu>
                            <MenuButton
                                width="min-content"
                                as={IconButton}
                                aria-label="Options"
                                icon={<RxHamburgerMenu />}
                                variant="outline"
                            ></MenuButton>
                            <MenuList>
                                {/* <MenuItem>Edit</MenuItem> */}
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
                    <Text color="whiteAlpha.700" fontSize="sm">
                        Added by {recipeData.recipe.user?.username}
                    </Text>
                </Stack>
            )}
        </Stack>
    );
};
export default RecipeHeader;
