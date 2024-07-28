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
import {CssBaseline} from '@mui/material';
import {createTheme, responsiveFontSizes, ThemeProvider} from '@mui/material/styles';
import useSettings from 'hooks/useSettings';
import {merge} from 'merge';
import getConfig from 'next/config';
import {useRouter} from 'next/router';
import {FC, ReactNode} from 'react';
import customThemeOptions from './themeOptions';

// =======================================================
type MuiThemeProps = {children?: ReactNode};
// =======================================================

const MuiTheme: FC<MuiThemeProps> = ({children}) => {
  const {settings} = useSettings();
  const router = useRouter();
  const {pathname: path, query} = router;
  const realPath = router.asPath;
  const {publicRuntimeConfig} = getConfig(); // Value is coming from next.config.js

  const themeOptions = customThemeOptions(publicRuntimeConfig, realPath, settings);
  themeOptions.palette.mode = settings.mode;

  let theme = createTheme(
    merge({}, {...themeOptions, direction: settings.direction}),
  );
  theme = responsiveFontSizes(theme);
  //console.log(`[${new Date().toLocaleString()}] [INFO] MuiTheme.tsx : theme for site `, theme);

  // theme shadows
  theme.shadows[1] = '0px 1px 3px rgba(3, 0, 71, 0.09)';
  theme.shadows[2] = '0px 4px 16px rgba(43, 52, 69, 0.1)';
  theme.shadows[3] = '0px 8px 45px rgba(3, 0, 71, 0.09)';
  theme.shadows[4] = '0px 0px 28px rgba(3, 0, 71, 0.01)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiTheme;
