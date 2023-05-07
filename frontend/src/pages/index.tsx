import {
    Box,
    Button,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Auth from '../components/Auth/Auth';
import Main from '../components/Main/Main';
import { authOptions } from './api/auth/[...nextauth]';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

export default function Home() {
    // TODO: https://chakra-ui.com/docs/styled-system/color-mode#add-colormodemanager-optional-for-ssr
    const { colorMode, toggleColorMode } = useColorMode();
    const { data: session } = useSession();

    const bg = useColorModeValue('primary.light', 'primary.dark');

    const reloadSession = () => {
        const event = new Event('visibilitychange');
        document.dispatchEvent(event);
    };

    return (
        <Box bg={bg}>
            {session?.user.username ? (
                <Main session={session} />
            ) : (
                <Auth
                    session={session}
                    reloadSession={reloadSession}
                />
            )}

            <Button
                my={4}
                onClick={toggleColorMode}
                position="fixed"
                right={5}
                bottom={0}
            >
                {colorMode === 'light' ? (
                    <BsFillMoonFill />
                ) : (
                    <BsFillSunFill />
                )}
            </Button>
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps = async (
    context
) => {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    };
};
