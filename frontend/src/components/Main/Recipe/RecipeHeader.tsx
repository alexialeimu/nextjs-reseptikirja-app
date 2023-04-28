import { useQuery } from '@apollo/client';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipesData } from '@/src/util/types';

interface RecipeHeaderProps {
    recipeId: string | string[];
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipeId }) => {
    const router = useRouter();
    const { data, loading } = useQuery<RecipesData, {}>(
        recipeQueryStrings.Queries.recipes
    );

    const selectedRecipe = data?.recipes.find(
        (r) => r.id === recipeId
    );

    return (
        <Stack
            direction="row"
            align="center"
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
            {!selectedRecipe && !loading && (
                <Text>Recipe Not Found</Text>
            )}
            {selectedRecipe && (
                <Stack direction="row">
                    <Text fontWeight={600} fontSize={'3xl'}>
                        {selectedRecipe.name}
                    </Text>
                    <Text>{selectedRecipe.user?.username}</Text>
                </Stack>
            )}
        </Stack>
    );
};
export default RecipeHeader;
