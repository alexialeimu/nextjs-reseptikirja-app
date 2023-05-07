import { Button, Collapse, Flex, Slide } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import RecipeListWrapper from './RecipeList/RecipeListWrapper';
import RecipeWrapper from './Recipe/RecipeWrapper';
import { Session } from 'next-auth';
import { useState } from 'react';
// import { FiMenu } from 'react-icons/fi';
// import { RxDoubleArrowLeft } from 'react-icons/rx';

interface MainProps {
    session: Session;
}

const Main: React.FC<MainProps> = ({ session }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <Flex>
            <RecipeListWrapper
                session={session}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            {/* <Button
                onClick={toggleSidebar}
                // position={'relative'}
                bg={'transparent'}
                _hover={{ bg: 'transparent' }}
                // size={'lg'}
            >
                {isSidebarOpen ? <RxDoubleArrowLeft /> : <FiMenu />}
            </Button> */}
            <RecipeWrapper
                session={session}
                isSidebarOpen={isSidebarOpen}
            />
        </Flex>
    );
};

export default Main;
