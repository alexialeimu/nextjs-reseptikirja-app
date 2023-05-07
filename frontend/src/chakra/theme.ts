import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            primary: {
                dark: 'blackAlpha.800',
                light: 'whiteAlpha.50',
            },
            heading: {
                dark: '',
                light: '#0A392C',
            },
            text: {
                dark: 'whiteAlpha.200',
                light: 'blackAlpha.800',
            },
            leadParagraph: {
                dark: 'whiteAlpha.600',
                light: 'blackAlpha.600',
            },
            accent: {
                dark: '',
                light: '#EAE3C0',
            },
        },
        styles: {
            global: () => ({
                body: {
                    bg: 'whiteAlpha.50',
                },
                p: {
                    fontFamily: 'body',
                    fontWeight: '300',
                    // fontWeight: '400',
                },
            }),
        },
        textStyles: {
            h1: {
                fontFamily: 'heading',
                fontWeight: 'bold',
                letterSpacing: '0.02em',
                'font-size': {
                    base: '2rem !important',
                    md: '3rem !important',
                },
                'margin-bottom': '15px',
            },
            leadParagraph: {
                fontFamily: 'body',
                fontWeight: '400',
                // color: 'whiteAlpha.600',
                fontSize: { base: '1rem', md: '1.15rem' },
            },
            p: {
                fontFamily: 'body',
                fontWeight: '200',
            },
        },
        fonts: {
            heading: `'Playfair Display', sans-serif`,
            body: `'Karla', sans-serif`,
        },
    }
);
