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
import {ThemeOptions} from '@mui/material/styles';
import typography from '@/theme/typography';
import components from '@/theme/components';
import themeColors, {primary} from '@/theme/themeColors';

/********************************************
 * You can delete themeOptions.ts file and
 * rename this file to `themeOptions.ts`
 * Follow the documentation for more details
 *********************************************/

const THEMES = {
  GIFT: 'GIFT',
  HEALTH: 'HEALTH',
  DEFAULT: 'DEFAULT',
  GROCERY: 'GROCERY',
  FURNITURE: 'FURNITURE',
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1140, //1280
    xl: 1920,
  },
};

const themesOptions: ThemeOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {primary: {...primary, light: primary[100]}, ...themeColors},
  },
  //   [THEMES.GROCERY]: {
  //     typography,
  //     breakpoints,
  //     components: { ...components },
  //     palette: { primary: { ...primary, light: primary[100] }, ...themeColors },
  //   },
  //   [THEMES.FURNITURE]: {
  //     typography,
  //     breakpoints,
  //     components: { ...components },
  //     palette: { primary: { ...paste, light: paste[100] }, ...themeColors },
  //   },
  //   [THEMES.HEALTH]: {
  //     typography,
  //     breakpoints,
  //     components: { ...components },
  //     palette: { primary: { ...blue, light: blue[100] }, ...themeColors },
  //   },
  //   [THEMES.GIFT]: {
  //     typography,
  //     breakpoints,
  //     components: { ...components },
  //     palette: { primary: { ...marron, light: marron[100] }, ...themeColors },
  //   },
};

const themeOptions = (publicRuntimeConfig?: any, pathname?: string) => {
  // YOU CAN SET ANOTHER THEME HERE E.G. [THEMES.GROCERY] OR [THEMES.FURNITURE] ETC.
  let themeOptions: ThemeOptions = themesOptions[THEMES.DEFAULT];

  return themeOptions;
};

export default themeOptions;
