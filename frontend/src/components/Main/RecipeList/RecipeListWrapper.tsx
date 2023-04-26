import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeList from './RecipeList';
import RecipeOperations from '../../../graphql/operations/recipe';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { RecipesData } from '@/src/util/types';

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
    } = useQuery(RecipeOperations.Queries.recipes);

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

    const subscribeToNewRecipes = () => {
        subscribeToMore({
            document: RecipeOperations.Subscriptions.recipeCreated,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;

                const newRecipe = subscriptionData.data.recipeCreated;

                return Object.assign({}, prev, {
                    recipes: [newRecipe, ...prev.recipes],
                });
            },
        });
    };

    // Execute subscription on mount
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
