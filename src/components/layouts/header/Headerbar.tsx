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
import {FC} from 'react';
//mui
import {Box, styled} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//bloomreach sdks
import {BrComponent} from '@bloomreach/react-sdk';
//hocks
import useSettings from '@/hooks/useSettings';
//components
import {FlexBox, JustifiedFlexBox, JustifiedFlexContainer} from '@/components/common/flex-box';
//types
import {layoutConstant} from '@/utils/constants';
//functions
import {getThemeColor} from '@/utils/ThemeUtils';

type HeaderbarProps = {};

const Headerbar: FC<HeaderbarProps> = (): React.ReactElement => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const {settings} = useSettings();
  const headerbar = settings.layouts.headerbar;

  const HeaderWrapper = styled(Box)(
    ({theme}) => ({
      backgroundColor: getThemeColor(theme, headerbar.bgColor),
      borderBottom: headerbar.borderBottom,
      borderBottomColor: getThemeColor(theme, headerbar.borderColor),
      color: getThemeColor(theme, headerbar.color),
      maxHeight: headerbar.height || layoutConstant.headerHeight,
      marginBottom: headerbar.mb,
      marginTop: headerbar.mt,
      paddingBottom: headerbar.pb,
      paddingTop: headerbar.pt,
      position: 'relative',
      transition: 'height 250ms ease-in-out',
      zIndex: 3,
      [theme.breakpoints.down('sm')]: {
        maxHeight: headerbar.mobileHeight || layoutConstant.mobileHeaderHeight,
      },
    }),
  );

  // SMALLER SCREEN DISPLAY
  if (downMd) {
    return (
      <HeaderWrapper component='header' boxShadow={headerbar.elevation}>
        <JustifiedFlexContainer maxWidth={headerbar.maxWidth as Breakpoint}>
          <JustifiedFlexBox width='100%'>
            <Box flex={1} overflow='hidden'>
              <BrComponent path='header/row2__col1' />
            </Box>
            <FlexBox justifyContent='space-between' overflow='hidden'>
              <BrComponent path='header/row2__col2' />
              <BrComponent path='header/row2__col3' />
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
          <BrComponent path='header/row2__col1' />
        </FlexBox>
        <FlexBox alignItems='center' justifyContent='center' flex='1 1 0'>
          <BrComponent path='header/row2__col2' />
        </FlexBox>
        <FlexBox alignItems='center' ml={2} justifyContent='flex-end'>
          <BrComponent path='header/row2__col3' />
        </FlexBox>
      </JustifiedFlexContainer>
    </HeaderWrapper>
  );
};

export default Headerbar;