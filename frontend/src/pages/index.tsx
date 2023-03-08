import { Box } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Auth from '../components/Auth/Auth';
import Main from '../components/Main/Main';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
    const { data: session } = useSession();

    const reloadSession = () => {};

    return (
        <Box>
            {session?.user.username ? (
                <Main />
            ) : (
                <Auth
                    session={session}
                    reloadSession={reloadSession}
                />
            )}
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
