import {
    Box,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface InputElementProps {
    title: string;
    data: string[];
    helpText: string;
    changeCategories: (newArr: string[]) => void;
}

const InputElement: React.FC<InputElementProps> = ({
    title,
    data,
    helpText,
    changeCategories,
}) => {
    const [tags, setTags] = useState<string[]>(data);
    const [inputValue, setInputValue] = useState('');

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
        if (tags.includes(value)) return;
        setTags([...tags, value]);
        setInputValue('');
    }

    function removeTag(index: number) {
        setTags(tags.filter((el, i) => i !== index));
    }

    useEffect(() => {
        changeCategories(tags);
    }, [tags]);

    return (
        <>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <Flex
                    alignItems={'center'}
                    flexWrap={'wrap'}
                    gap={'.5em'}
                >
                    {tags.map((tag, index) => (
                        <Box
                            key={index}
                            display={'inline-block'}
                            p="0.5em 0.75em"
                            borderRadius="20px"
                            bg={'blackAlpha.400'}
                        >
                            <Box as="span">{tag}</Box>
                            <Box
                                as="span"
                                height="20px"
                                width="20px"
                                borderRadius="50%"
                                display={'inline-flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                cursor={'pointer'}
                                onClick={() => removeTag(index)}
                            >
                                &times;
                            </Box>
                        </Box>
                    ))}
                    <Input
                        type="text"
                        placeholder="Type something"
                        display="flex"
                        flexGrow={1}
                        value={inputValue}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={handleKeyDown}
                    ></Input>
                </Flex>
                <FormHelperText mb={3}>{helpText}</FormHelperText>
            </FormControl>
        </>
    );
};

export default InputElement;
