import { RecipeData, RecipeState } from '@/src/util/types';
import {
    FormControl,
    FormLabel,
    Input,
    Textarea,
} from '@chakra-ui/react';

interface TextareaElementProps {
    title: string;
    data: string;
    rows: number;
    handleChange: (e: any) => void;
}

const TextareaElement: React.FC<TextareaElementProps> = ({
    title,
    data,
    rows,
    handleChange,
}) => {
    return (
        <>
            <FormControl>
                <FormLabel>{title}</FormLabel>
                <Textarea
                    placeholder={title}
                    rows={rows}
                    value={data}
                    onChange={(e) => handleChange(e)}
                ></Textarea>
            </FormControl>
        </>
    );
};

export default TextareaElement;
