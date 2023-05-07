import {
    Box,
    Flex,
    ListItem,
    OrderedList,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
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
    const accentColor = useColorModeValue(
        'accent.light',
        'accent.dark'
    );

    let formattedMethod = '';
    let recipeMethod = [''];

    if (recipeData && !recipeLoading) {
        recipeMethod = recipeData?.recipe.recipeMethod ?? [];
    }

    console.log(recipeData?.recipe);

    if (recipeMethod.length === 1) {
        formattedMethod = recipeMethod
            ? recipeMethod[0].replace(/\n/g, '<br>')
            : '';
    }

    const formattedIngredients = recipeData?.recipe.ingredients
        ? recipeData.recipe.ingredients.replace(/\n/g, '<br>')
        : '';

    return (
        <Flex
            flexDirection={{
                base: 'column',
                lg: 'row',
            }}
            // justifyContent={'space-between'}
            justifyContent={'flex'}
            gap={5}
        >
            <Stack width={{ base: '100%', lg: '40%' }}>
                {recipeData &&
                    !recipeLoading &&
                    recipeData?.recipe.ingredients && (
                        <Box
                            bg={accentColor}
                            p="20px"
                            width="100%"
                            position={{
                                base: 'relative',
                                lg: 'sticky',
                            }}
                            top={{ base: 'initial', lg: '0' }}
                        >
                            <Text
                                dangerouslySetInnerHTML={{
                                    __html: formattedIngredients,
                                }}
                            ></Text>
                        </Box>
                    )}
            </Stack>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                width={{ base: '100%', lg: '55%' }}
            >
                {recipeMethod?.length === 1 ? (
                    <Text
                        dangerouslySetInnerHTML={{
                            __html: formattedMethod,
                        }}
                    ></Text>
                ) : (
                    <OrderedList ml={3}>
                        {recipeMethod.map((step, i) => (
                            <ListItem key={i} ml={3} py={3}>
                                {step}
                            </ListItem>
                        ))}
                    </OrderedList>
                )}
                ;
            </Stack>
        </Flex>
    );
};
export default RecipeContent;
