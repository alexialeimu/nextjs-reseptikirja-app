import { useMutation } from '@apollo/client';
import {
    Button,
    Center,
    Image,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import UserOperations from '../../graphql/operations/user';
import {
    CreateUsernameData,
    CreateUsernameVariables,
} from '@/src/util/types';

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}

// username doesn't exist
const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
    const [username, setUsername] = useState('');
    const [createUsername, { data, loading, error }] = useMutation<
        CreateUsernameData,
        CreateUsernameVariables
    >(UserOperations.Mutations.createUsername);

    const onSubmit = async () => {
        if (!username) return;
        try {
            await createUsername({ variables: { username } });
        } catch (error) {
            console.log('onSubmit error', error);
        }
    };

    console.log('DATA', data, loading, error);

    return (
        <Center height="100vh">
            <Stack spacing={4} align="center">
                {session ? (
                    <>
                        <Text fontSize="3xl">Create a username</Text>
                        <Input
                            placeholder="Enter a username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        ></Input>
                        <Button width="100%" onClick={onSubmit}>
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Text fontSize="3xl">Reseptikirja App</Text>
                        <Button
                            onClick={() => signIn('google')}
                            leftIcon={
                                <Image
                                    height="20px"
                                    src="/images/googlelogo.png"
                                    alt="Google"
                                />
                            }
                        >
                            Continue with Google
                        </Button>
                    </>
                )}
            </Stack>
        </Center>
    );
};

export default Auth;
