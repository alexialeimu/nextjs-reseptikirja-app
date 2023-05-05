import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import RecipeListWrapper from './RecipeList/RecipeListWrapper';
import RecipeWrapper from './Recipe/RecipeWrapper';
import { Session } from 'next-auth';

interface MainProps {
    session: Session;
}

const Main: React.FC<MainProps> = ({ session }) => {
    return (
        <Flex height="100vh">
            <RecipeListWrapper session={session} />
            <RecipeWrapper session={session} />
        </Flex>
    );
};

export default Main;
