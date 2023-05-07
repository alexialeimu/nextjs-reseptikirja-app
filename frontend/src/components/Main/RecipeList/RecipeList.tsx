import {
    Box,
    Button,
    SkeletonText,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import RecipeModal from './Modal/Modal';
import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useRouter } from 'next/router';
import { RecipePopulated } from '../../../../../backend/src/util/types';
import { signOut } from 'next-auth/react';
import SkeletonLoader from '../../common/SkeletonLoader';

interface RecipeListProps {
    session: Session;
    recipes: Array<RecipePopulated>;
    recipesLoading: boolean;
    onViewRecipe: (recipeId: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
    session,
    recipes,
    recipesLoading,
    onViewRecipe,
}) => {
    const bg = useColorModeValue('accent.light', 'accent.dark');
    const headingColor = useColorModeValue(
        'heading.light',
        'heading.dark'
    );

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const router = useRouter();

    const recipesLoadingg = true;

    return (
        <Stack width="100%" justify="space-between">
            <Box width="100%">
                {!recipesLoading && (
                    <>
                        <Box
                            py={2}
                            px={4}
                            mb={4}
                            bg={bg}
                            borderRadius={4}
                            cursor="pointer"
                            onClick={onOpen}
                        >
                            <Text textAlign="center" fontWeight={500}>
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
                    </>
                )}
                {recipesLoading ? (
                    <Box w="100%">
                        <SkeletonText
                            mt="16"
                            noOfLines={5}
                            spacing="7"
                            skeletonHeight="3"
                        />
                    </Box>
                ) : (
                    recipes.map((r) => (
                        <RecipeCard
                            key={r.id}
                            recipe={r}
                            isSelected={
                                r.id === router.query.recipeId
                            }
                            onClick={() => onViewRecipe(r.id)}
                        />
                    ))
                )}
            </Box>
            {!recipesLoading && (
                <Box width="100%">
                    <Button width="100%" onClick={() => signOut()}>
                        Sign Out
                    </Button>
                </Box>
            )}
        </Stack>
    );
};

export default RecipeList;
