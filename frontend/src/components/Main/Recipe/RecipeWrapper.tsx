import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

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
                <Flex>{recipeId}</Flex>
            ) : (
                <div>No recipe selected</div>
            )}
        </Flex>
    );
};

export default RecipeWrapper;
