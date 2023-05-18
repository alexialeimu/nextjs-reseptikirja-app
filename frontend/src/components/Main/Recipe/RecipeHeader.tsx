import { useMutation, useQuery } from '@apollo/client';
import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    SkeletonText,
    Stack,
    Tag,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import recipeQueryStrings from '@/src/graphql/operations/recipe';
import { RecipeData, RecipesData } from '@/src/util/types';
import { AiOutlineEdit } from 'react-icons/ai';
import { CiClock2, CiForkAndKnife } from 'react-icons/ci';
import { FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import RecipeModal from '../RecipeList/Modal/Modal';
import { Session } from 'next-auth';
import SkeletonLoader from '../../common/SkeletonLoader';
import DeleteModal from '../RecipeList/Modal/DeleteModal';

interface RecipeHeaderProps {
    // recipeId: string | string[];
    session: Session;
    recipeData: RecipeData | undefined;
    recipeLoading: boolean;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    session,
    recipeData,
    recipeLoading,
}) => {
    const headingColor = useColorModeValue(
        'heading.light',
        'heading.dark'
    );
    const leadParagraphColor = useColorModeValue(
        'leadParagraph.dark',
        'leadParagraph.light'
    );

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalIsOpen] = useState(false);

    return (
        <Stack
            direction="column"
            py={2}
            borderBottom="1px solid"
            borderColor="whiteAlpha.200"
            pb={5}
            mb={5}
        >
            {!recipeLoading && (
                <Button
                    display={{ md: 'none' }}
                    onClick={() =>
                        router.replace('?recipeId', '/', {
                            shallow: true,
                        })
                    }
                    mb={2}
                    data-testid="backButton"
                >
                    Back
                </Button>
            )}
            {!recipeData && !recipeLoading && (
                <Text>Recipe Not Found</Text>
            )}
            {recipeLoading && (
                <>
                    <SkeletonLoader
                        count={1}
                        height="57px"
                        width="50%"
                    />
                    <Flex gap={'1.5rem'}>
                        <Box width="111px">
                            <SkeletonText
                                mt="8"
                                noOfLines={1}
                                spacing="4"
                                skeletonHeight="3"
                            />
                        </Box>
                        <Box width="154px">
                            <SkeletonText
                                mt="8"
                                noOfLines={1}
                                spacing="4"
                                skeletonHeight="3"
                            />
                        </Box>
                    </Flex>
                    <Box width="70%">
                        <SkeletonText
                            mt="8"
                            noOfLines={3}
                            spacing="4"
                            skeletonHeight="3"
                        />
                    </Box>
                    <Flex gap={'1.5rem'}>
                        <Box width="110px">
                            <SkeletonText
                                mt="8"
                                noOfLines={1}
                                spacing="4"
                                skeletonHeight="3"
                            />
                        </Box>
                        <Box width="110px">
                            <SkeletonText
                                mt="8"
                                noOfLines={1}
                                spacing="4"
                                skeletonHeight="3"
                            />
                        </Box>
                        <Box width="110px">
                            <SkeletonText
                                mt="8"
                                noOfLines={1}
                                spacing="4"
                                skeletonHeight="3"
                            />
                        </Box>
                    </Flex>
                    <Box width="50%">
                        <SkeletonText
                            mt="8"
                            noOfLines={1}
                            spacing="4"
                            skeletonHeight="2"
                        />
                    </Box>
                </>
            )}
            {recipeData?.recipe && (
                <Stack direction="column">
                    <RecipeModal
                        session={session}
                        recipe={recipeData}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        isEditRecipeMode={true}
                    />
                    <DeleteModal
                        recipe={recipeData}
                        isOpen={isDeleteModalOpen}
                        onClose={() => setDeleteModalIsOpen(false)}
                    />
                    <Flex justifyContent="space-between">
                        <Heading
                            as="h1"
                            textStyle="h1"
                            color={headingColor}
                        >
                            {recipeData.recipe.name}
                        </Heading>

                        <Menu>
                            <MenuButton
                                width="min-content"
                                as={IconButton}
                                aria-label="Options"
                                icon={<AiOutlineEdit />}
                                variant="outline"
                                data-testid="menuButton"
                            ></MenuButton>
                            <MenuList data-testid="menuList">
                                <MenuItem
                                    onClick={(event) => {
                                        setIsOpen(true);
                                    }}
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={(e) =>
                                        setDeleteModalIsOpen(true)
                                    }
                                >
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    {(recipeData.recipe.servings ||
                        recipeData.recipe.time) && (
                        <Flex flexDirection={'row'} gap={6} pb={4}>
                            {recipeData.recipe.servings && (
                                <Text
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <CiForkAndKnife
                                        size={'2em'}
                                        data-testid="servingsIcon"
                                    />
                                    {recipeData.recipe.servings}{' '}
                                    servings
                                </Text>
                            )}
                            {recipeData.recipe.time && (
                                <Text
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <CiClock2
                                        size={'2em'}
                                        data-testid="cookTimeIcon"
                                    />
                                    Cooks in {recipeData.recipe.time}{' '}
                                    min
                                </Text>
                            )}
                        </Flex>
                    )}
                    {recipeData.recipe.description &&
                        recipeData.recipe.description !== '' && (
                            <Text
                                width={{ base: '100%', lg: '70%' }}
                                textStyle="leadParagraph"
                                color={leadParagraphColor}
                                data-testid="descriptionElement"
                            >
                                {recipeData?.recipe.description}
                            </Text>
                        )}
                    {recipeData.recipe.categories.length > 0 && (
                        <Flex pt={4} gap={2}>
                            {recipeData.recipe.categories.map(
                                (c, i) => (
                                    <Tag key={i}>{c.name}</Tag>
                                )
                            )}
                        </Flex>
                    )}
                    <Flex
                        pt={5}
                        flexDirection={{
                            base: 'column',
                            lg: 'row',
                        }}
                        alignItems={'flex-start'}
                        gap={3}
                    >
                        <Text
                            color={headingColor}
                            fontSize="sm"
                            textTransform={'uppercase'}
                        >
                            Added by{' '}
                            {recipeData.recipe.user?.username}
                        </Text>
                        {recipeData.recipe.link && (
                            <>
                                <Text
                                    display={{
                                        base: 'none',
                                        lg: 'block',
                                    }}
                                    color={headingColor}
                                >
                                    &#x2022;
                                </Text>

                                <Flex>
                                    <Text
                                        as="span"
                                        fontSize="sm"
                                        mr={1}
                                        color={headingColor}
                                    >
                                        Source:
                                    </Text>
                                    <Link
                                        fontSize="sm"
                                        href={recipeData.recipe.link}
                                        color={headingColor}
                                        noOfLines={1}
                                        isExternal
                                        display={'flex'}
                                        alignItems={'center'}
                                        gap={1}
                                    >
                                        {recipeData.recipe.link}
                                        <FiExternalLink />
                                    </Link>
                                </Flex>
                            </>
                        )}
                    </Flex>
                </Stack>
            )}
        </Stack>
    );
};
export default RecipeHeader;
