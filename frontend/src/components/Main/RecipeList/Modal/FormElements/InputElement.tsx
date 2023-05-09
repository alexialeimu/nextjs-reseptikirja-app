import { RecipeData, RecipeState } from '@/src/util/types';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface InputElementProps {
    title: string;
    data: string;
    handleChange: (e: any) => void;
    isRequired: boolean;
}

const InputElement: React.FC<InputElementProps> = ({
    title,
    data,
    handleChange,
    isRequired,
}) => {
    return (
        <>
            <FormControl isRequired={isRequired}>
                <FormLabel>{title}</FormLabel>
                <Input
                    type="text"
                    placeholder={title}
                    value={data}
                    onChange={(e) => handleChange(e)}
                ></Input>
            </FormControl>
        </>
    );
};

export default InputElement;
