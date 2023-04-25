import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeList from './RecipeList';

interface RecipeListWrapperProps {
    session: Session;
}

const RecipeListWrapper: React.FC<RecipeListWrapperProps> = ({
    session,
}) => {
    return (
        <Box
            width={{ base: '100%', md: '400px' }}
            bg="whiteAlpha.50"
            py={6}
            px={3}
        >
            {/* Skeleton Loader here */}
            <RecipeList session={session} />
        </Box>
    );
};

export default RecipeListWrapper;
