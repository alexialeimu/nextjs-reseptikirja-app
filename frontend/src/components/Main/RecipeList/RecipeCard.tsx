import { Stack, Text } from '@chakra-ui/react';

interface RecipeCardProps {
    recipe: any;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Stack>
            <Text>
                {recipe.name} ({recipe.user.username})
            </Text>
        </Stack>
    );
};

export default RecipeCard;
