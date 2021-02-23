import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
        color: 'gray.800',
        background: 'gray.100',
      },
      '.nodeLink': {
        color: 'red',
        path: {
          stroke: 'red',
        },
      },
    },
  },
  colors: {
    brand: {
      50: '#d9f3ff',
      100: '#acddff',
      200: '#7bcbff',
      300: '#49bbff',
      400: '#1aafff',
      500: '#0087e6',
      600: '#005db4',
      700: '#003982',
      800: '#001d51',
      900: '#000721',
    },
  },
});

export default theme;
