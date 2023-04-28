import { Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { RecipeData, RecipesData } from '@/src/util/types';

interface RecipeContentProps {
    recipeData: RecipeData | undefined;
    recipeLoading: boolean;
}

const RecipeContent: React.FC<RecipeContentProps> = ({
    recipeData,
    recipeLoading,
}) => {
    console.log('RECIPE DATA', recipeData);
    return (
        <Stack direction="column" py={2}>
            <Text>{recipeData?.recipe.instructions}</Text>;
        </Stack>
    );
};
export default RecipeContent;
