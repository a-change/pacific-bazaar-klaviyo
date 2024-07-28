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

//react
import {FC, Fragment, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
//mui
import {Box, Stack, styled} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//bloomreach sdk
import {BrComponent, BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import Sticky from '@/components/common/bazaar/Sticky';
//types
import {THEMES, themesOptions} from '@/theme/themeOptions';
//functions
import {getJsonAsset, getResourceBundle} from '@/utils/ApiUtils';
//templates
import Footer from '@/components/layouts/footer/Footer';
import MobileNavbar from '@/components/layouts/footer/MobileNavbar';
import {Headerbar, Navbar, Topbar} from './header';
//Config JSON
import channelSettingsMock from '../../../mocks/styles/channel-example.json';
import {FooterComponent} from '@/components/footer/FooterComponent';
import {HeaderComponent} from '@/components/header/HeaderComponent';
import {createPaletteFromColor} from 'palettey';
import {supplyPrimary} from '@/theme/themeColors';
import {getColorCode} from '@/theme/themeUtils';

type BaseLayoutProps = {children: ReactNode};

/* hst-container */
const BaseLayoutBox = styled(Box)({
  '& .hst-container': {
    minWidth: '100px',
  },
});

const BaseLayout: FC<BaseLayoutProps> = ({children}): React.ReactElement => {
  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const {settings, updateSettings} = useSettings();
  const {channelId, layouts} = settings;
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed: boolean) => setIsFixed(fixed), []);

  const updateThemeAndConfigs = async (channelConfigFile, channelThemeFile, channelLayouts, pacificTheme, pacificThemePrimaryColor, pacificThemeSecondaryColor) => {
    let channelThemes = pacificTheme ? themesOptions[pacificTheme] : {};
    let selectedTheme = pacificTheme;
    if (pacificThemePrimaryColor && pacificThemeSecondaryColor) {
      // Build the custom theme
      selectedTheme = THEMES.CUSTOM;
      const customPrimary = {};
      const palette = createPaletteFromColor('primary', getColorCode(pacificThemePrimaryColor), {});
      Object.entries(palette?.primary).forEach((entry) => {
        const [step, color] = entry;
        customPrimary[parseInt(step)] = color;
      });
      customPrimary['main'] = getColorCode(pacificThemePrimaryColor);

      const customSecondary = {};
      const paletteSecondary = createPaletteFromColor('secondary', getColorCode(pacificThemeSecondaryColor), {});
      Object.entries(paletteSecondary?.secondary).forEach((entry) => {
        const [step, color] = entry;
        customSecondary[parseInt(step)] = color;
      });
      customSecondary['main'] = getColorCode(pacificThemeSecondaryColor);

      themesOptions[THEMES.CUSTOM].palette.primary = {...customPrimary, light: customPrimary[100]};
      themesOptions[THEMES.CUSTOM].palette.secondary = {...customSecondary, light: customSecondary[100]};

      channelThemes = themesOptions[THEMES.CUSTOM];
    }
    if (channelThemeFile) {
      channelThemes = await getJsonAsset(channelThemeFile);
    }
    const channelConfigs = await getResourceBundle(channelId, channelConfigFile);
    const newSettings = await {
      ...settings,
      layouts: channelLayouts,
      themes: channelThemes,
      channelConfigs: channelConfigs,
      selectedTheme,
    };
    updateSettings(newSettings);
  };

  useEffect(() => {
    const channelParameters = page.getChannelParameters();
    const {
      channelConfigFile,
      channelThemeFile,
      pacificTheme,
      pacificThemePrimaryColor,
      pacificThemeSecondaryColor,
    } = channelParameters;
    const channelLayouts = {...channelSettingsMock.layouts, origin: 'channel'};
    updateThemeAndConfigs(channelConfigFile, channelThemeFile, channelLayouts, pacificTheme, pacificThemePrimaryColor, pacificThemeSecondaryColor);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isPreview = page.isPreview();
  return (
    <BaseLayoutBox>

      {/* grid header implementation */}
      {/* TOPBAR */}
      {layouts.topbar.show && <Topbar />}

      {/* HEADER */}
      {layouts.navbar.show && (
        <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={isPreview ? 30000 : 300}>
          <Fragment>
            {downMd &&
              <Stack direction={'row'} alignItems={'center'}>
                <Box sx={{flexGrow: 1}}>
                  <BrComponent path='header-static'>
                    <HeaderComponent />
                  </BrComponent>
                  {/* Cross Pillar Demo */}
                  <BrComponent path='menu'>
                    <HeaderComponent />
                  </BrComponent>
                  <Headerbar />
                </Box>
                <Navbar />
              </Stack>
            }
            {!downMd && <BrComponent path='header-static'>
              <HeaderComponent />
            </BrComponent>}
            {/* Cross Pillar Demo */}
            {!downMd && <BrComponent path='menu'>
              <HeaderComponent />
            </BrComponent>}
            {!downMd && <Headerbar />}
          </Fragment>
        </Sticky>
      )}

      <div className='section-after-sticky'>
        {/* NAVIGATION BAR */}
        {!downMd && layouts.navbar.show && <Navbar />}

        {/* BODY CONTENT */}
        {children}
      </div>

      {/* SMALL DEVICE BOTTOM NAVIGATION */}
      {layouts.mobilenavbar.show && <MobileNavbar />}

      {/* FOOTER */}
      {layouts.footer.show && <Footer {...{page, component}} />}
    </BaseLayoutBox>
  );
};

export default BaseLayout;
