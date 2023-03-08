import { Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

interface MainProps {}

const Main: React.FC<MainProps> = () => {
    return <Button onClick={() => signOut()}>Sign Out</Button>;
};

export default Main;
