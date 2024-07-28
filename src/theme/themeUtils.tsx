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
// TODO: GET THEME DYNAMICALLY BASED ON CHANNEL SETTINGS
import {SettingsOptions} from '@/contexts/SettingContext';
import breakpoints from './breakpoints';
import components from './components';
import themeColors from './themeColors';
import typography from './typography';

export const getDynamicThemeOptions = (settings: SettingsOptions) => {
  const {mode, themes} = settings;

  let palette;
  if (mode === 'dark' && themes?.dark) {
    palette = {...themeColors, ...themes.dark};
  } else if (themes?.light) {
    palette = {...themeColors, ...themes.light};
  } else if (themes?.palette) {
    palette = {...themeColors, ...themes.palette};
  } else {
    //TODO: better way to set background color???
    if (mode === 'dark') {
      palette = {...themeColors};
    } else {
      palette = {
        ...themeColors, ...{
          background: {default: '#F6F9FC', paper: '#fff'},
        },
      };
    }
  }

  const dynamicThemeOptions = {
    typography: themes?.typography ? {...typography, ...themes.typography} : typography,
    breakpoints: themes?.breakpoints ? {...breakpoints, ...themes.breakpoints} : breakpoints,
    components: {...components},
    palette,
  };

  return dynamicThemeOptions;
};

export const getColorCode = (colorCode: string) => {
  return colorCode.startsWith('#') ? colorCode : '#' + colorCode;
};
