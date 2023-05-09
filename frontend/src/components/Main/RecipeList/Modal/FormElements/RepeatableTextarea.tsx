import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Textarea,
    VStack,
    VisuallyHidden,
} from '@chakra-ui/react';

interface RepeatableTextareaProps {
    title: string;
    data: string[];
    textareaCount: number;
    placeholderText: string;
    helpText: string;
    rows: number;
    setTextareaCount: (a: number) => void;
    handleChange: (e: any, i: number) => void;
}

const RepeatableTextarea: React.FC<RepeatableTextareaProps> = ({
    title,
    data,
    textareaCount,
    setTextareaCount,
    placeholderText,
    helpText,
    rows,
    handleChange,
}) => {
    return (
        <fieldset>
            <legend>{title}</legend>
            <VStack>
                {[...Array(textareaCount)].map((_, index) => (
                    <FormControl key={index}>
                        <FormLabel>
                            <VisuallyHidden>
                                {placeholderText} {index + 1}
                            </VisuallyHidden>
                        </FormLabel>
                        {index === 0 && (
                            <FormHelperText mb={3}>
                                {helpText}
                            </FormHelperText>
                        )}
                        <Textarea
                            key={index}
                            placeholder={`${placeholderText} ${
                                index + 1
                            }`}
                            rows={rows}
                            value={data[index]}
                            onChange={(e) => handleChange(e, index)}
                        ></Textarea>
                    </FormControl>
                ))}
                <HStack>
                    <Button
                        isDisabled={textareaCount <= 1}
                        onClick={() =>
                            setTextareaCount(textareaCount - 1)
                        }
                    >
                        -
                    </Button>
                    <Button
                        onClick={() =>
                            setTextareaCount(textareaCount + 1)
                        }
                    >
                        +
                    </Button>
                </HStack>
            </VStack>
        </fieldset>
    );
};

export default RepeatableTextarea;
