import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeModal from './Modal/Modal';
import { useState } from 'react';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
    session: Session;
    recipes: Array<any>;
}

const RecipeList: React.FC<RecipeListProps> = ({
    session,
    recipes,
}) => {
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
            <RecipeModal
                session={session}
                isOpen={isOpen}
                onClose={onClose}
            />
            {recipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
            ))}
        </Box>
    );
};

export default RecipeList;
