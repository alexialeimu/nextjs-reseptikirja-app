import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeModal from './Modal/Modal';
import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRouter } from 'next/router';
import { RecipePopulated } from '../../../../../backend/src/util/types';
import { signOut } from 'next-auth/react';

interface RecipeListProps {
    session: Session;
    recipes: Array<RecipePopulated>;
    onViewRecipe: (recipeId: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
    session,
    recipes,
    onViewRecipe,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const router = useRouter();

    return (
        <Stack width="100%" justify="space-between">
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
                    recipe={null}
                    isOpen={isOpen}
                    onClose={onClose}
                    isEditRecipeMode={false}
                />
                {recipes.map((r) => (
                    <RecipeCard
                        key={r.id}
                        recipe={r}
                        isSelected={r.id === router.query.recipeId}
                        onClick={() => onViewRecipe(r.id)}
                    />
                ))}
            </Box>
            <Box width="100%">
                <Button width="100%" onClick={() => signOut()}>
                    Sign Out
                </Button>
            </Box>
        </Stack>
    );
};

export default RecipeList;
