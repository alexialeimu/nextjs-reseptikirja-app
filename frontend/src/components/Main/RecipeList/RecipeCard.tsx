import { RecipePopulated } from '@/../backend/src/util/types';
import { Skeleton, Stack, Text } from '@chakra-ui/react';

interface RecipeCardProps {
    recipe: RecipePopulated;
    isSelected: boolean;
    onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    isSelected,
    onClick,
}) => {
    const handleClick = (event: React.MouseEvent) => {
        if (event.type === 'click') {
            onClick();
        }
    };

    return (
        <Stack
            py={3}
            _hover={{ bg: 'whiteAlpha.200' }}
            cursor="pointer"
            onClick={handleClick}
            // bg={isSelected ? 'whiteAlpha.200' : 'none'}
        >
            <Text>
                {recipe.name}
                {/* ({recipe.user && recipe.user.username}) */}
            </Text>
        </Stack>
    );
};

export default RecipeCard;
