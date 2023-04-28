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
    const instructions = recipeData?.recipe.instructions;

    const formattedInstructions = instructions
        ? instructions.replace(/\n/g, '<br>')
        : '';
    console.log('RECIPE DATA', recipeData);
    return (
        <Stack
            direction="column"
            py={2}
            width={{ base: '100%', lg: '60%' }}
        >
            <Text
                dangerouslySetInnerHTML={{
                    __html: formattedInstructions,
                }}
            ></Text>
            ;
        </Stack>
    );
};
export default RecipeContent;
