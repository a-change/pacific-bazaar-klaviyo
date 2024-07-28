/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Components, Theme} from '@mui/material';
import {dark, grey} from './themeColors';
import {fontFamily, fontSize} from './typography';

// ========================================================
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    dark: true;
    paste: true;
    marron: true;
  }

  interface ButtonPropsSizeOverrides {
    normal: true;
  }
}
// =========================================================

const components: Components = {
  MuiCssBaseline: {
    styleOverrides: (theme: Theme) => ({
      'html': {scrollBehavior: 'smooth'},
      'p': {lineHeight: 1.75},
      'button': {fontFamily, fontSize},
      '.MuiRating-sizeSmall': {fontSize: '20px'},
      'a': {
        textDecoration: 'none',
        color: 'inherit',
      },
      'ul': {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      '#nprogress .bar': {
        overflow: 'hidden',
        height: '3px !important',
        zIndex: '99999999 !important',
        background: `${theme.palette.primary.main} !important`,
      },
    }),
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {zIndex: 0},
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {borderRadius: 8},
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {borderRadius: '8px'},
    },
  },
  MuiPagination: {
    defaultProps: {
      variant: 'outlined',
      color: 'primary',
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {paddingTop: 8, paddingBottom: 8},
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        '& .secondary': {opacity: 0.4},
      },
    },
  },
  MuiTextField: {
    defaultProps: {size: 'small', variant: 'outlined'},
    styleOverrides: {
      root: ({ownerState}) => ({
        ...(ownerState.color === 'info' && {
          '& .MuiOutlinedInput-root': {borderRadius: '8px', fontWeight: 600},
          '& .MuiOutlinedInput-notchedOutline': {borderColor: grey[300]},
        }),
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ownerState}) => ({
        minWidth: 0,
        minHeight: 0,
        fontWeight: 600,
        textTransform: 'capitalize',
        ...(ownerState.color === 'info' && {borderRadius: '8px'}),
        ...(ownerState.color === 'dark' && {
          'color': '#fff',
          'borderRadius': 0,
          'transition': 'all 0.3s',
          ':hover': {backgroundColor: '#343434'},
        }),
        ...(ownerState.color === 'dark' &&
          ownerState.variant === 'outlined' && {
            'color': dark.main,
            'borderRadius': '3px',
            'transition': 'all 0.3s',
            ':hover': {backgroundColor: dark.main, color: 'white'},
          }),
      }),
      sizeLarge: {padding: '.6rem 2.5rem'},
    },
    defaultProps: {color: 'inherit'},
  },
};

export default components;
