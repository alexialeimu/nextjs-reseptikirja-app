import { useQuery } from '@apollo/client';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
// import ConversationOperations from '../../../../graphql/operations/conversation';
// import { formatUsernames } from '../../../../util/functions';
// import { ConversationsData } from '../../../../util/types';
// import SkeletonLoader from "../../../common/SkeletonLoader";

interface RecipeHeaderProps {
    recipeId: string | string[];
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipeId }) => {
    const router = useRouter();
    // const { data, loading } = useQuery<ConversationsData, null>(
    //     ConversationOperations.Queries.conversations
    // );

    // const conversation = data?.conversations.find(
    //     (conversation) => conversation.id === recipeId
    // );

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
            {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}
            {/* {!conversation && !loading && ( */}
            <Text>Recipe Not Found</Text>
            {/* )} */}
            {/* {conversation && ( */}
            {/* <Stack direction="row">
                <Text color="whiteAlpha.600">To: </Text>
                <Text fontWeight={600}>{recipeId}</Text>
            </Stack> */}
            {/* )} */}
        </Stack>
    );
};
export default RecipeHeader;
