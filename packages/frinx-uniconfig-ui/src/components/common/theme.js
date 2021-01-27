import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo';

export const DARK = {
    D10: '#F5F7FC',
    D50: '#EDF0F9',
    D100: '#D2DAE7',
    D200: '#B8C2D3',
    D300: '#9DA9BE',
    D400: '#8895AD',
    D500: '#73839E',
    D600: '#64748C',
    D700: '#536074',
    D800: '#434D5E',
    D900: '#303846',
};

export const BLUE = {
    B50: '#E4F2FF',
    B100: '#BDDEFF',
    B200: '#93C9FF',
    B300: '#66B4FF',
    B400: '#48A3FF',
    B500: '#3593FF',
    B600: '#3984FF',
    B700: '#3A71EA',
    B800: '#3A5FD7',
    B900: '#383DB7',
};

export const RED = {
    R600: '#FA383E',
    R700: '#E03237',
    R800: '#C82C31',
};

export default createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: "#005da7",
        },
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                background: 'linear-gradient(-90deg, rgba(0,149,255,0.91) 0%, #005da7 100%)'
            },
        },
    },
    typography: {
        h1: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: '96px',
            lineHeight: 1.33,
            letterSpacing: '-1.5px',
        },
        h2: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: '60px',
            lineHeight: 1.33,
            letterSpacing: '-0.5px',
        },
        h3: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '48px',
            lineHeight: 1.33,
            letterSpacing: '0px',
        },
        h4: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '32px',
            lineHeight: 1.25,
            letterSpacing: '0.25px',
        },
        h5: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: 1.33,
            letterSpacing: '0px',
        },
        h6: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: 'normal',
            letterSpacing: '0.25px',
        },
        body1: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: 1.5,
            letterSpacing: '0.15px',
        },
        body2: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: 1.43,
            letterSpacing: '0.25px',
        },
        subtitle1: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: 1.5,
            letterSpacing: '0.15px',
        },
        subtitle2: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: 1.71,
            letterSpacing: '0.1px',
        },
        subtitle3: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: 1.14,
            letterSpacing: '1.25px',
            textTransform: 'uppercase',
        },
        caption: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: 1.33,
            letterSpacing: 'normal',
        },
        overline: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: 1.33,
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
    },
});