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
import React from 'react';
//mui
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Box, styled} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
//Bloomreach sdks
import {BrProps} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {FlexBox, JustifiedFlexBox, JustifiedFlexContainer} from '@/components/common/flex-box';
import {Logo} from '@/components/common/logo/Logo';
import {HeaderToolbarComponent} from '@/components/header-toolbar/HeaderToolbarComponent';
//types
import {HeaderTemplateProps} from '@/components/header/HeaderComponentTypes';
import {layoutConstant} from '@/utils/constants';
//functions
import {getThemeColor} from '@/utils/ThemeUtils';
import {SearchBoxComponent} from '@/components/search-box/SearchBoxComponent';

export const HeaderDefault = (props: BrProps & HeaderTemplateProps) => {
  const {page, component, headerParams, headerContent} = props;

  const {template, backgroundColor} = headerParams;
  const {} = headerContent;

  const theme = useTheme();
  const {settings} = useSettings();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const headerbar = settings.layouts.headerbar;

  const HeaderWrapper = styled(Box)(
    ({theme}) => ({
      backgroundColor: getThemeColor(theme, headerbar.bgColor),
      borderBottom: headerbar.borderBottom,
      borderBottomColor: getThemeColor(theme, headerbar.borderColor),
      color: getThemeColor(theme, headerbar.color),
      height: headerbar.height || layoutConstant.headerHeight,
      marginBottom: headerbar.mb,
      marginTop: headerbar.mt,
      paddingBottom: headerbar.pb,
      paddingTop: headerbar.pt,
      position: 'relative',
      transition: 'height 250ms ease-in-out',
      zIndex: 3,
      [theme.breakpoints.down('sm')]: {
        height: headerbar.mobileHeight || layoutConstant.mobileHeaderHeight,
      },
    }),
  );

  // SMALLER SCREEN DISPLAY
  if (downMd) {
    return (
      <HeaderWrapper component='header' boxShadow={headerbar.elevation}>
        <JustifiedFlexContainer maxWidth={headerbar.maxWidth as Breakpoint}>
          <JustifiedFlexBox width='100%'>
            <Box>
            </Box>
            <Box flex={1} overflow='hidden'>
              <Logo {...{page, component}} />
            </Box>
            <FlexBox justifyContent='space-between' overflow='hidden'>
              <SearchBoxComponent  {...{page, component}} />
              <HeaderToolbarComponent {...{page, component}} />
            </FlexBox>
          </JustifiedFlexBox>
        </JustifiedFlexContainer>
      </HeaderWrapper>
    );
  }

  // LARGER SCREEN DISPLAY
  return (
    <HeaderWrapper component='header' boxShadow={headerbar.elevation}>
      <JustifiedFlexContainer maxWidth={headerbar.maxWidth as Breakpoint}>
        <FlexBox alignItems='center' mr={2} justifyContent='flex-start'>
          <Logo {...{page, component}} />
        </FlexBox>
        <FlexBox alignItems='center' justifyContent='center' flex='1 1 0'>
          <SearchBoxComponent  {...{page, component}} />
        </FlexBox>
        <FlexBox alignItems='center' ml={2} justifyContent='flex-end'>
          <HeaderToolbarComponent {...{page, component}} />
        </FlexBox>
      </JustifiedFlexContainer>
    </HeaderWrapper>
  );
};