/* eslint-disable @typescript-eslint/naming-convention */
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading:
      '"Noto Sans", -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
    body: '"Noto Sans", -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
  },
  styles: {
    global: {
      'html, body': {
        background: 'gray.50',
        overflowX: 'hidden',
      },
      '.chakra-link.active': {
        borderColor: 'blue.600',
        color: 'blue.600',
        background: 'blue.50',
        '&:hover': {
          borderColor: 'blue.600',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        // borderRadius: 6,
      },
    },
    Table: {
      baseStyle: {
        boxShadow: 'md',
      },
    },
    FormLabel: {
      baseStyle: {
        fontWeight: 600,
      },
    },
  },
  colors: {
    blue: {
      '50': '#E8F3FD',
      '100': '#BEDFF9',
      '200': '#94CAF5',
      '300': '#6AB5F0',
      '400': '#41A0EC',
      '500': '#178CE8',
      '600': '#1270BA',
      '700': '#0E548B',
      '800': '#09385D',
      '900': '#051C2E',
    },
    gray: {
      '50': '#F2F2F3',
      '100': '#D9D9DD',
      '200': '#C1C1C8',
      '300': '#A9A9B2',
      '400': '#90909D',
      '500': '#787887',
      '600': '#60606C',
      '700': '#484851',
      '800': '#303036',
      '900': '#18181B',
    },
  },
});

export default theme;
