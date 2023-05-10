import { useQuery } from '@apollo/client';
import CategoryOperations from '../../../../graphql/operations/category';
import { CategoriesData } from '@/src/util/types';
import { Flex, Input, Box, Button } from '@chakra-ui/react';
import { useState } from 'react';

interface TagListProps {}

const TagList: React.FC<TagListProps> = (props) => {
    const [selectedCategories, setSelectedCategories] = useState<
        string[]
    >([]);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategories((prev: string[]) => {
            if (prev.includes(categoryName)) {
                return prev.filter(
                    (id: string) => id !== categoryName
                );
            } else {
                return [...prev, categoryName];
            }
        });
    };

    const {
        data: categoryData,
        error: categoryError,
        loading: categoryLoading,
        subscribeToMore,
    } = useQuery<CategoriesData>(
        CategoryOperations.Queries.GET_ALL_CATEGORIES
    );

    console.log(selectedCategories);

    return (
        <>
            <Flex
                alignItems={'center'}
                flexWrap={'wrap'}
                gap={'.5em'}
                mb={2}
            >
                {categoryData?.categories.map((category) => (
                    <Button
                        key={category.id}
                        display={'inline-block'}
                        p="0.5em 1em"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.16)"
                        borderRadius="20px"
                        cursor="pointer"
                        _hover={{
                            border: '2px solid',
                            margin: '-1px',
                        }}
                        onClick={() => {
                            handleCategoryClick(category.name);
                        }}
                        bg={
                            selectedCategories.includes(category.name)
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'transparent'
                        }
                        fontWeight={'normal'}
                    >
                        <Box as="span">{category.name}</Box>
                    </Button>
                ))}
            </Flex>
        </>
    );
};

export default TagList;
