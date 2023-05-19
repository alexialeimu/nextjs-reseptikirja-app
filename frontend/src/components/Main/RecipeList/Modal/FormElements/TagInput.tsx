import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    VisuallyHidden,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CategoriesData } from '@/src/util/types';
import { useQuery } from '@apollo/client';
import CategoryOperations from '../../../../../graphql/operations/category';

interface TagInputProps {
    title: string;
    data: string[];
    helpText: string;
    changeCategories: (newArr: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
    title,
    data,
    helpText,
    changeCategories,
}) => {
    const [addedCategories, setAddedCategories] = React.useState<
        string[]
    >([]);
    const [inputValue, setInputValue] = useState('');

    const helpText2 =
        'Select from existing categories and/or add new categories below.';

    const [selectedCategories, setSelectedCategories] =
        useState<string[]>(data);

    const {
        data: categoryData,
        error: categoryError,
        loading: categoryLoading,
        subscribeToMore,
    } = useQuery<CategoriesData>(
        CategoryOperations.Queries.GET_ALL_CATEGORIES
    );

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // do nothing if comma is entered
        if (e.target.value.includes(',')) {
            return;
        } else {
            setInputValue(e.target.value);
        }
    };

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        // add tag to list when comma is entered
        if (e.key !== ',') return;
        const value = inputValue;
        if (!value.trim()) return;
        // don't add the tag if it already exists
        if (addedCategories.includes(value)) return;
        setAddedCategories([...addedCategories, value]);
        setSelectedCategories([...selectedCategories, value]);
        setInputValue('');
    }

    function removeTag(index: number) {
        setAddedCategories(
            addedCategories.filter((el, i) => i !== index)
        );
        setSelectedCategories(
            selectedCategories.filter((el, i) => i !== index)
        );
    }

    useEffect(() => {
        changeCategories(selectedCategories);
    }, [selectedCategories]);

    return (
        <>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <FormHelperText mb={3}>{helpText2}</FormHelperText>
                <Flex
                    alignItems={'center'}
                    flexWrap={'wrap'}
                    gap={'.5em'}
                    mb={3}
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
                                height: '42px',
                            }}
                            onClick={() => {
                                handleCategoryClick(category.name);
                            }}
                            bg={
                                selectedCategories.includes(
                                    category.name
                                )
                                    ? 'rgba(255, 255, 255, 0.25)'
                                    : 'transparent'
                            }
                            fontWeight={'normal'}
                        >
                            <Box as="span">{category.name}</Box>
                            {selectedCategories.includes(
                                category.name
                            ) ? (
                                <VisuallyHidden>
                                    Selected
                                </VisuallyHidden>
                            ) : (
                                <VisuallyHidden>
                                    Not selected
                                </VisuallyHidden>
                            )}
                        </Button>
                    ))}
                    {addedCategories.map((addedCategory, index) => (
                        <Box
                            key={index}
                            lineHeight="22px"
                            display={'inline-block'}
                            p="0.5em 1em"
                            border="1px solid"
                            borderColor="rgba(255, 255, 255, 0.16)"
                            borderRadius="20px"
                            bg={'rgba(255, 255, 255, 0.25)'}
                            fontWeight={'normal'}
                        >
                            <Box as="span">{addedCategory}</Box>
                            <Box
                                as="span"
                                mr="-5px"
                                // height="20px"
                                width="20px"
                                borderRadius="50%"
                                display={'inline-flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                cursor="pointer"
                                onClick={() => removeTag(index)}
                            >
                                &times;
                            </Box>
                        </Box>
                    ))}
                </Flex>
                <Flex
                    alignItems={'center'}
                    flexWrap={'wrap'}
                    gap={'.5em'}
                >
                    <Input
                        type="text"
                        placeholder="Type something"
                        display="flex"
                        flexGrow={1}
                        value={inputValue}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={handleKeyDown}
                        data-testid="input-field"
                    ></Input>
                </Flex>
                <FormHelperText mb={3}>{helpText}</FormHelperText>
            </FormControl>
        </>
    );
};

export default TagInput;
