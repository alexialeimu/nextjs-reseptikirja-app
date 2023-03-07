import { GetServerSideProps, NextPageContext } from 'next';
import { getServerSession } from 'next-auth';
import {
    getSession,
    signIn,
    signOut,
    useSession,
} from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
    const { data } = useSession();
    return (
        <div>
            {data?.user ? (
                <button onClick={() => signOut()}>Sign Out</button>
            ) : (
                <button onClick={() => signIn('google')}>
                    Sign In
                </button>
            )}
            {data?.user?.name}
        </div>
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
