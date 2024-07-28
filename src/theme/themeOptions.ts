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
import {SettingsOptions} from '@/contexts/SettingContext';
import {ThemeOptions} from '@mui/material/styles';
import breakpoints from './breakpoints';
import components from './components';
import themeColors, {
  grey,
  homePrimary,
  homeSecondary,
  info,
  marron,
  paste,
  primary,
  supplyPrimary,
  supplySecondary,
} from './themeColors';
import {getDynamicThemeOptions} from './themeUtils';
import typography from './typography';

export const THEMES = {
  GIFT: 'maroon',
  HEALTH: 'blue',
  DEFAULT: 'DEFAULT',
  GROCERY: 'red',
  FURNITURE: 'teal',
  HOME: 'home',
  SUPPLY: 'supply',
  CUSTOM: 'custom',
};

/*
WE CREATED MULTIPLE THEME OPTIONS FOR DIFFERENT SHOP VARIATION.

YOU CAN JUST KEEP [THEMES.DEFAULT] AND REMOVE OTHER THEME OPTIONS.
*/
export const themesOptions: ThemeOptions = {
  /*
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: {...components},
    palette: { ...themeColors, primary: {...primary, light: primary[100]}},
  },
   */
  [THEMES.GROCERY]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {...themeColors, primary: {...primary, light: primary[100]}},
  },
  [THEMES.FURNITURE]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {...themeColors, primary: {...paste, light: paste[100]}},
  },
  [THEMES.HEALTH]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {...themeColors, primary: {...info, light: info[100]}},
  },
  [THEMES.GIFT]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {...themeColors, primary: {...marron, light: marron[100]}},
  },
  [THEMES.HOME]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {
      ...themeColors,
      primary: {...homePrimary, light: homePrimary[100]},
      secondary: {...homeSecondary, light: homeSecondary[100]},
      background: {default: grey[100], paper: '#FFFFFF'},
    },
  },
  [THEMES.SUPPLY]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {
      ...themeColors,
      primary: {...supplyPrimary, light: supplyPrimary[100]},
      secondary: {...supplySecondary, light: supplySecondary[100]},
      background: {default: grey[100], paper: '#FFFFFF'},
    },
  },
  [THEMES.CUSTOM]: {
    typography,
    breakpoints,
    components: {...components},
    palette: {
      ...themeColors,
      background: {default: grey[100], paper: '#FFFFFF'},
    },
  },
};

themesOptions[THEMES.DEFAULT] = themesOptions[THEMES.HOME];

const themeOptions = (publicRuntimeConfig: any, pathname: string, settings: SettingsOptions) => {
  let themeOptions: ThemeOptions = getDynamicThemeOptions(settings);

  if (!themeOptions) {
    themeOptions = themesOptions[publicRuntimeConfig.theme];
  }

  return themeOptions;
};

export default themeOptions;
