import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            brand: {
                100: 'yellow.400',
            },
        },
        styles: {
            global: () => ({
                body: {
                    bg: 'whiteAlpha.50',
                },
            }),
        },
    }
);
