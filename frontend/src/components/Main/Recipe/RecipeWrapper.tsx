import {
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import RecipeHeader from './RecipeHeader';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import RecipeContent from './RecipeContent';
import { MdDelete } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';

interface RecipeWrapperProps {
    session: Session;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({ session }) => {
    const router = useRouter();

    const { recipeId } = router.query;

    const { data, loading } = useQuery<RecipeData, {}>(
        recipeQueryStrings.Queries.GET_RECIPE,
        { variables: { recipeId } }
    );

    return (
        <Flex
            display={{ base: recipeId ? 'flex' : 'none', md: 'flex' }}
            width="100%"
            direction="column"
            mx={{ base: '6', md: '10' }}
            my={3}
        >
            {recipeId ? (
                <Flex
                    direction="column"
                    justify="space-between"
                    overflow="hidden"
                    flexGrow={1}
                >
                    <Stack>
                        <RecipeHeader
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
