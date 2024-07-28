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
interface CustomPaletteColor {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  600: string;
  700: string;
  800: string;
  900: string;
  dark: string;
  light: string;
  main: string;
  contrastText: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    dark: CustomPaletteColor;
    paste: CustomPaletteColor;
    marron: CustomPaletteColor;
  }

  interface PaletteOptions {
    dark: CustomPaletteColor;
    paste: CustomPaletteColor;
    marron: CustomPaletteColor;
  }
}

export const grey = {
  100: '#F6F9FC',
  200: '#F3F5F9', // Line Stroke
  300: '#E3E9EF',
  400: '#DAE1E7', // Border
  500: '#AEB4BE',
  600: '#7D879C', // Low Priority form Title/Text
  700: '#4B566B',
  800: '#373F50', // Paragraph
  900: '#2B3445', // Main Text
};

export const primary = {
  100: '#FCE9EC',
  200: '#F8C7CF',
  300: '#F07D90',
  400: '#EC6178',
  500: '#D23F57', // Main
  600: '#E63E58',
  700: '#E3364E',
  800: '#DF2E44',
  900: '#D91F33',
  main: '#D23F57',
  contrastText: '#FFFFFF',
};

export const secondary = {
  100: '#e8e8ee',
  200: '#b9bacb',
  300: '#8a8ca8',
  400: '#5b5d85',
  500: '#141850',
  600: '#0F3460', // Main
  700: '#101340',
  800: '#0e1138',
  900: '#0c0e30',
  main: '#0F3460',
  dark: '#0c0e30',
};

export const error = {
  100: '#FFEAEA',
  200: '#FFCBCB',
  300: '#FFA9A9',
  400: '#FF6D6D',
  500: '#FF5353',
  600: '#FF4C4C',
  700: '#FF4242',
  800: '#FF3939',
  900: '#FF2929',
  main: '#E94560',
  contrastText: '#FFFFFF',
};

export const info = {
  50: '#f3f5f9',
  100: '#DBF0FE',
  200: '#B8DEFE',
  300: '#94C9FE',
  400: '#7AB6FD',
  500: '#4E97FD', // Main
  600: '#3975D9',
  700: '#2756B6',
  800: '#183C92',
  900: '#0E2979',
  main: '#4E97FD',
  contrastText: '#FFFFFF',
};

export const success = {
  100: '#E7F9ED',
  200: '#C2F1D1',
  300: '#99E8B3',
  400: '#52D77E',
  500: '#33D067',
  600: '#2ECB5F',
  700: '#27C454',
  800: '#20BE4A',
  900: '#0b7724',
  main: 'rgb(51, 208, 103)',
};

export const warning = {
  100: '#FFF8E5',
  500: '#FFCD4E', // Main
  main: '#FFCD4E',
  contrastText: '#FFFFFF',
};

export const marron = {
  50: '#f3f5f9',
  100: '#F6F2ED',
  200: '#F8DBD1',
  300: '#EBBCB3',
  400: '#D89C98',
  500: '#BE7374', // Main
  600: '#A3545C',
  700: '#883948',
  800: '#6E2438',
  900: '#5B162F',
  main: '#BE7374',
};

export const paste = {
  50: '#F5F5F5',
  100: '#DDFBF1',
  200: '#BDF7E8',
  300: '#97E8DA',
  400: '#76D2CA',
  500: '#4BB4B4',
  600: '#36929A',
  700: '#257181',
  800: '#175368',
  900: '#0E3D56',
  main: '#4BB4B4',
  contrastText: '#FFFFFF',
};

// Build a neutral theme for home
// https://mui.com/joy-ui/customization/theme-builder/
export const neutral = {
  50: '#F7F7F8',
  100: '#EBEBEF',
  200: '#D8D8DF',
  300: '#B9B9C6',
  400: '#8F8FA3',
  500: '#73738C', // Main
  600: '#5A5A72',
  700: '#434356',
  800: '#25252D',
  900: '#131318',
  main: '#73738C',
};

// https://m2.material.io/inline-tools/color/
export const homePrimary = {
  50: '#fcfcfc',
  100: '#f7f7f7',
  200: '#f2f2f2',
  300: '#ebebeb',
  400: '#cacaca',
  500: '#acacac',
  600: '#828282', // Main
  700: '#6d6d6d',
  800: '#4e4e4e',
  900: '#2b2b2b',
  main: '#828282',
};

export const homeSecondary = {
  50: '#eaedf8',
  100: '#ccd4e2',
  200: '#aeb7c9',
  300: '#8f9ab1',
  400: '#78849e',
  500: '#62708c',
  600: '#54627b',
  700: '#444f65',
  800: '#343d4f', // Main
  900: '#212938',
  main: '#343d4f',
};

export const supplyPrimary = {
  50: '#e0f7fb',
  100: '#b3ecf5',
  200: '#81e0ef',
  300: '#4fd3e7',
  400: '#28c9e1',
  500: '#09bfdb',
  600: '#06afc8',
  700: '#029aad',
  800: '#008695', // Main
  900: '#006369',
  main: '#008695',
};

export const supplySecondary = {
  50: '#eaedf8',
  100: '#ccd4e2',
  200: '#aeb7c9',
  300: '#8f9ab1',
  400: '#78849e',
  500: '#62708c',
  600: '#54627b',
  700: '#444f65',
  800: '#343d4f', // Main
  900: '#212938',
  main: '#343d4f',
};

export const dark = {main: '#222'};
export const white = {main: '#fff'};

const themeColors = {
//  background: {default: grey[100], paper: '#fff'},
  dark,
  // divider: grey[200],
  error,
  // grey,
  info,
  marron,
  paste,
  primary,
  secondary,
  success,
  // text: {primary: grey[900], secondary: grey[800], disabled: grey[400]},
  warning,
  white,
  neutral,
};

export default themeColors;
