import { Stack, Text } from '@chakra-ui/react';

interface RecipeCardProps {
    recipe: any;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    console.log(recipe);
    return (
        <Stack py={3} _hover={{ bg: 'whiteAlpha.200' }}>
            <Text>
                {recipe.name} ({recipe.user && recipe.user.username})
            </Text>
        </Stack>
    );
};

export default RecipeCard;
