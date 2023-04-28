import { useQuery } from '@apollo/client';
import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData, RecipesData } from '@/src/util/types';

interface RecipeHeaderProps {
    recipeId: string | string[];
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipeId }) => {
    const router = useRouter();

    const { data, loading } = useQuery<RecipeData, {}>(
        recipeQueryStrings.Queries.GET_RECIPE,
        { variables: { recipeId } }
    );

    return (
        <Stack>
            <Stack
                direction="column"
                // align="center"
                spacing={6}
                py={5}
                px={{ base: 4, md: 0 }}
                borderColor="whiteAlpha.200"
            >
                <Button
                    display={{ md: 'none' }}
                    onClick={() =>
                        router.replace('?recipeId', '/', {
                            shallow: true,
                        })
                    }
                >
                    Back
                </Button>
                {!data && !loading && <Text>Recipe Not Found</Text>}
                {data && (
                    <Stack direction="column">
                        <Text fontWeight={600} fontSize={'4xl'}>
                            {data.recipe.name}
                        </Text>
                        <Text>{data.recipe.user?.username}</Text>
                    </Stack>
                )}
            </Stack>
            {data && <Text>{data.recipe.instructions}</Text>}
        </Stack>
    );
};
export default RecipeHeader;
