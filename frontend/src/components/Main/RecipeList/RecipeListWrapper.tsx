import {
    Box,
    Button,
    Flex,
    useColorModeValue,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeList from './RecipeList';
import RecipeOperations from '../../../graphql/operations/recipe';
import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    CategoriesData,
    RecipeCreatedSubscriptionData,
    RecipeDeletedSubscriptionData,
    RecipeUpdatedSubscriptionData,
    RecipesData,
} from '@/src/util/types';

import { FiMenu } from 'react-icons/fi';
import { RxDoubleArrowLeft } from 'react-icons/rx';
import categoryQueryStrings from '@/src/graphql/operations/category';

interface RecipeListWrapperProps {
    session: Session;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const RecipeListWrapper: React.FC<RecipeListWrapperProps> = ({
    session,
    isSidebarOpen,
    toggleSidebar,
}) => {
    const {
        data: recipesData,
        error: recipesError,
        loading: recipesLoading,
        subscribeToMore,
    } = useQuery<RecipesData>(
        RecipeOperations.Queries.GET_ALL_RECIPES
    );

    const router = useRouter();
    const {
        query: { recipeId },
    } = router;

    const onViewRecipe = async (recipeId: string) => {
        /**
         *  Push the recipeId to the router query params
         */
        router.push({ query: { recipeId } });
    };

    /**
     * TODO: move these useSubscription hooks
     * into a separate file?
     */
    useSubscription<RecipeDeletedSubscriptionData, any>(
        RecipeOperations.Subscriptions.RECIPE_DELETED_SUBSCRIPTION,
        {
            /**
             * onData lets us register a callback function that is triggered each time
             * the useSubscription Hook / Subscription component receives data
             */
            onData: ({ client, data }) => {
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                /**
                 * Update all recipes data
                 */

                /**
                 * readQuery allows us to read data from the Apollo cache.
                 */
                const existing = client.readQuery<RecipesData>({
                    query: RecipeOperations.Queries.GET_ALL_RECIPES,
                });

                if (!existing) return;

                const { recipes } = existing;
                const {
                    recipeDeleted: {
                        recipe: { id: deletedRecipeId },
                        removedCategoriesIds,
                    },
                } = subscriptionData;

                /**
                 * writeQuery allows us to manually update
                 * the Apollo cache with new data.
                 */
                client.writeQuery<RecipesData>({
                    query: RecipeOperations.Queries.GET_ALL_RECIPES,
                    data: {
                        recipes: recipes.filter(
                            (recipe) => recipe.id !== deletedRecipeId
                        ),
                    },
                });

                /**
                 * Update categories data
                 */
                if (
                    removedCategoriesIds &&
                    removedCategoriesIds.length
                ) {
                    const categoriesData =
                        client.readQuery<CategoriesData>({
                            query: categoryQueryStrings.Queries
                                .GET_ALL_CATEGORIES,
                        });

                    if (!categoriesData) return;

                    client.writeQuery<CategoriesData>({
                        query: categoryQueryStrings.Queries
                            .GET_ALL_CATEGORIES,
                        data: {
                            categories:
                                categoriesData.categories.filter(
                                    (a) =>
                                        !removedCategoriesIds.includes(
                                            a.id
                                        )
                                ),
                        },
                    });
                }
            },
        }
    );

    useSubscription<RecipeUpdatedSubscriptionData, any>(
        RecipeOperations.Subscriptions.RECIPE_UPDATED_SUBSCRIPTION,
        {
            onData: ({ client, data }) => {
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                const {
                    recipeUpdated: {
                        recipe: updatedRecipe,
                        addedCategories,
                        emptyCategoriesIds,
                    },
                } = subscriptionData;

                const cacheData = client.readQuery<RecipesData>({
                    query: RecipeOperations.Queries.GET_ALL_RECIPES,
                });

                if (!cacheData) return;

                /**
                 * TODO: Now the updated recipe is first deleted from
                 * the list and below added with updated data.
                 * Therefore, the recipe goes up on the list.
                 */
                const cacheDataFiltered = cacheData.recipes.filter(
                    (recipe) => recipe.id !== updatedRecipe.id
                );

                client.writeQuery<RecipesData>({
                    query: RecipeOperations.Queries.GET_ALL_RECIPES,
                    data: {
                        recipes: [
                            updatedRecipe,
                            ...cacheDataFiltered,
                        ],
                    },
                });

                /**
                 * Update categories data. First, get
                 * the cached data.
                 */
                const cachedCategoriesData =
                    client.readQuery<CategoriesData>({
                        query: categoryQueryStrings.Queries
                            .GET_ALL_CATEGORIES,
                    });

                if (!cachedCategoriesData) return;

                /**
                 * Remove the emptied categories from
                 * the cached categories data
                 */
                const cacheWithoutEmptyCategories =
                    cachedCategoriesData.categories.filter(
                        (category) =>
                            !emptyCategoriesIds.includes(category.id)
                    );

                client.writeQuery<CategoriesData>({
                    query: categoryQueryStrings.Queries
                        .GET_ALL_CATEGORIES,
                    data: {
                        categories: [
                            ...cacheWithoutEmptyCategories,
                            ...addedCategories,
                        ],
                    },
                });
            },
        }
    );

    /**
     * Update full category list with newly added categories
     */
    useSubscription(
        RecipeOperations.Subscriptions.RECIPE_CREATED_SUBSCRIPTION,
        {
            onData: ({ client, data }) => {
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                /**
                 * Update categories data
                 */
                const cachedCategoriesData =
                    client.readQuery<CategoriesData>({
                        query: categoryQueryStrings.Queries
                            .GET_ALL_CATEGORIES,
                    });

                if (!cachedCategoriesData) return;

                client.writeQuery<CategoriesData>({
                    query: categoryQueryStrings.Queries
                        .GET_ALL_CATEGORIES,
                    data: {
                        categories: [
                            ...cachedCategoriesData.categories,
                            ...subscriptionData.recipeCreated
                                .addedCategories,
                        ],
                    },
                });
            },
        }
    );

    /**
     * Add new recipe to the list of recipes
     */
    const subscribeToNewRecipes = () => {
        subscribeToMore({
            document:
                RecipeOperations.Subscriptions
                    .RECIPE_CREATED_SUBSCRIPTION,
            updateQuery: (
                prev,
                { subscriptionData }: RecipeCreatedSubscriptionData
            ) => {
                if (!subscriptionData) return prev;

                const newRecipe =
                    subscriptionData.data.recipeCreated.recipe;

                return Object.assign({}, prev, {
                    recipes: [newRecipe, ...prev.recipes],
                });
            },
        });
    };

    /**
     * Execute subscription on mount
     */
    useEffect(() => {
        subscribeToNewRecipes();
    }, []);

    return (
        <Flex>
            <Button
                display={{ base: 'none', md: 'block' }}
                onClick={toggleSidebar}
                position={'fixed'}
                bg={'transparent'}
                _hover={{ bg: 'transparent' }}
                size={'lg'}
                zIndex={10}
            >
                {isSidebarOpen ? <RxDoubleArrowLeft /> : <FiMenu />}
            </Button>
            <Box
                display={{
                    base: recipeId ? 'none' : 'flex',
                    md: isSidebarOpen ? 'flex' : 'none',
                }}
                width={{
                    base: '100%',
                    md: '300px',
                }}
                mt={3}
                py={10}
                px={3}
                height="100vh"
                position={'fixed'}
            >
                <RecipeList
                    session={session}
                    recipes={recipesData?.recipes || []}
                    onViewRecipe={onViewRecipe}
                    recipesLoading={recipesLoading}
                />
            </Box>
        </Flex>
    );
};

export default RecipeListWrapper;
