import { Flex, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import RecipeHeader from './RecipeHeader';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import RecipeContent from './RecipeContent';

interface RecipeWrapperProps {
    session: Session;
    isSidebarOpen: boolean;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({
    session,
    isSidebarOpen,
}) => {
    const router = useRouter();

    const { recipeId } = router.query;

    const { data, loading } = useQuery<RecipeData, {}>(
        recipeQueryStrings.Queries.GET_RECIPE,
        { variables: { recipeId } }
    );

    return (
        <Flex
            display={{
                base: recipeId ? 'flex' : 'none',
                md: 'flex',
            }}
            width={{
                base: '100%',
                md: isSidebarOpen ? '100%' : '80%',
            }}
            justifyContent={'center'}
            direction="column"
            pt={5}
            my={3}
            ml={{
                base: '0',
                md: isSidebarOpen ? '300px' : 'auto',
            }}
            px={{ base: '10px', md: '50px' }}
            mx={'auto'}
        >
            {recipeId ? (
                <Flex direction="column" justify="space-between">
                    <Stack>
                        <RecipeHeader
                            session={session}
                            recipeData={data}
                            recipeLoading={loading}
                        />
                        <RecipeContent
                            recipeData={data}
                            recipeLoading={loading}
                        />
                    </Stack>
                </Flex>
            ) : (
                <div>No recipe selected</div>
            )}
        </Flex>
    );
};

export default RecipeWrapper;
