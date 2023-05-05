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
    const method = recipeData?.recipe.method;

    const formattedMethod = method
        ? method.replace(/\n/g, '<br>')
        : '';
    return (
        <Stack
            direction="column"
            py={2}
            width={{ base: '100%', lg: '60%' }}
        >
            <Text
                dangerouslySetInnerHTML={{
                    __html: formattedMethod,
                }}
            ></Text>
            ;
        </Stack>
    );
};
export default RecipeContent;
