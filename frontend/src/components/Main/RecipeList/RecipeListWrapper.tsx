import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeList from './RecipeList';
import RecipeOperations from '../../../graphql/operations/recipe';
import { useQuery, useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    RecipeCreatedSubscriptionData,
    RecipeDeletedData,
    RecipesData,
} from '@/src/util/types';
import recipeQueryStrings from '../../../graphql/operations/recipe';

interface RecipeListWrapperProps {
    session: Session;
}

const RecipeListWrapper: React.FC<RecipeListWrapperProps> = ({
    session,
}) => {
    const {
        data: recipesData,
        error: recipesError,
        loading: recipesLoading,
        subscribeToMore,
    } = useQuery<RecipesData>(RecipeOperations.Queries.recipes);

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

    useSubscription<RecipeDeletedData, {}>(
        recipeQueryStrings.Subscriptions.recipeDeleted,
        {
            onData: ({ client, data }) => {
                const { data: subscriptionData } = data;

                if (!subscriptionData) return;

                const existing = client.readQuery<RecipesData>({
                    query: recipeQueryStrings.Queries.recipes,
                });

                if (!existing) return;

                const { recipes } = existing;
                const {
                    recipeDeleted: { id: deletedRecipeId },
                } = subscriptionData;

                client.writeQuery<RecipesData>({
                    query: recipeQueryStrings.Queries.recipes,
                    data: {
                        recipes: recipes.filter(
                            (recipe) => recipe.id !== deletedRecipeId
                        ),
                    },
                });
            },
        }
    );

    const subscribeToNewRecipes = () => {
        subscribeToMore({
            document: RecipeOperations.Subscriptions.recipeCreated,
            updateQuery: (
                prev,
                { subscriptionData }: RecipeCreatedSubscriptionData
            ) => {
                if (!subscriptionData) return prev;

                console.log(
                    'SUBSCRIPTION DATA:',
                    subscriptionData.data.recipeCreated
                );

                const newRecipe = subscriptionData.data.recipeCreated;

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
        <Box
            display={{ base: recipeId ? 'none' : 'flex', md: 'flex' }}
            width={{ base: '100%', md: '400px' }}
            bg="whiteAlpha.50"
            py={6}
            px={3}
        >
            {/* Skeleton Loader here */}
            <RecipeList
                session={session}
                recipes={recipesData?.recipes || []}
                onViewRecipe={onViewRecipe}
            />
        </Box>
    );
};

export default RecipeListWrapper;
