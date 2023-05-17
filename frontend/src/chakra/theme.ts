import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            primary: {
                dark: 'blackAlpha.800',
                light: '#faf9f2',
            },
            heading: {
                dark: '#849c95',
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
                dark: '#304442',
                light: '#EAE3C0',
            },
        },
        styles: {
            global: () => ({
                body: {
                    // bg: 'whiteAlpha.50',
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
                fontSize: {
                    base: '2rem !important',
                    md: '3rem !important',
                },
                marginBottom: '15px',
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
