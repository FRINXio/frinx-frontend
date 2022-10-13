/* eslint-disable @typescript-eslint/naming-convention */
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
        color: 'gray.800',
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
  },
  colors: {
    blue: {
      '50': '#EDECF8',
      '100': '#CCCAED',
      '200': '#ABA8E1',
      '300': '#8A86D5',
      '400': '#6964C9',
      '500': '#4842BD',
      '600': '#393597',
      '700': '#2B2871',
      '800': '#1D1A4C',
      '900': '#0E0D26',
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
