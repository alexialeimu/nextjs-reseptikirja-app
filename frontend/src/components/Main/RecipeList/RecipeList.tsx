import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeModal from './Modal/Modal';
import { useState } from 'react';

interface RecipeListProps {
    session: Session;
}

const RecipeList: React.FC<RecipeListProps> = ({ session }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    return (
        <Box width="100%">
            <Box
                py={2}
                px={4}
                mb={4}
                bg="blackAlpha.300"
                borderRadius={4}
                cursor="pointer"
                onClick={onOpen}
            >
                <Text
                    textAlign="center"
                    color="whiteAlpha.800"
                    fontWeight={500}
                >
                    Add a recipe
                </Text>
            </Box>
            <RecipeModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default RecipeList;
