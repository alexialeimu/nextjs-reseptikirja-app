import { ListItem, OrderedList, Stack, Text } from '@chakra-ui/react';
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
    const recipeMethod = recipeData?.recipe.recipeMethod ?? [];
    let formattedMethod = '';

    console.log(recipeData?.recipe);

    if (recipeMethod.length === 1) {
        formattedMethod = recipeMethod
            ? recipeMethod[0].replace(/\n/g, '<br>')
            : '';
    }

    return (
        <Stack
            direction="column"
            py={2}
            width={{ base: '100%', lg: '60%' }}
        >
            {recipeMethod?.length === 1 ? (
                <Text
                    dangerouslySetInnerHTML={{
                        __html: formattedMethod,
                    }}
                ></Text>
            ) : (
                <OrderedList ml={4}>
                    {recipeMethod.map((step, i) => (
                        <ListItem key={i} ml={2} py={3}>
                            {step}
                        </ListItem>
                    ))}
                </OrderedList>
            )}
            ;
        </Stack>
    );
};
export default RecipeContent;
