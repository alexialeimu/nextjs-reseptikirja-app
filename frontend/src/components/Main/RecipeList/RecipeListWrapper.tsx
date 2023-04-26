import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeList from './RecipeList';
import RecipeOperations from '../../../graphql/operations/recipe';
import { useQuery } from '@apollo/client';
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
    } = useQuery(RecipeOperations.Queries.recipes);

    console.log('HERE IS RECIPES DATA', recipesData);

    return (
        <Box
            width={{ base: '100%', md: '400px' }}
            bg="whiteAlpha.50"
            py={6}
            px={3}
        >
            {/* Skeleton Loader here */}
            <RecipeList
                session={session}
                recipes={recipesData?.recipes || []}
            />
        </Box>
    );
};

export default RecipeListWrapper;
