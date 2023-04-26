import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import RecipeHeader from './RecipeHeader';

interface RecipeWrapperProps {
    session: Session;
}

const RecipeWrapper: React.FC<RecipeWrapperProps> = ({ session }) => {
    const router = useRouter();

    const { recipeId } = router.query;

    return (
        <Flex
            display={{ base: recipeId ? 'flex' : 'none', md: 'flex' }}
            width="100%"
            direction="column"
        >
            {recipeId ? (
                <Flex
                    direction="column"
                    justify="space-between"
                    overflow="hidden"
                    flexGrow={1}
                >
                    {/* {recipeId} */}
                    <RecipeHeader recipeId={recipeId} />
                    {/* <RecipeContent /> */}
                </Flex>
            ) : (
                <div>No recipe selected</div>
            )}
        </Flex>
    );
};

export default RecipeWrapper;
