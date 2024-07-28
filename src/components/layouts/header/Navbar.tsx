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
import {Box, Breakpoint, styled} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//bloomreach sdks
import {BrComponent} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {FlexBox, JustifiedFlexContainer} from '@/components/common/flex-box';

type NavbarProps = {};

const Navbar: FC<NavbarProps> = (): React.ReactElement => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const {settings} = useSettings();
  const navbar = settings.layouts.navbar;

  const NavBarWrapper = styled(Box)(
    ({theme}) => ({
      backgroundColor: navbar.bgColor,
      borderBottom: navbar.borderBottom,
      borderBottomColor: navbar.borderColor,
      borderRadius: '0px',
      color: navbar.color,
      display: 'block',
      height: navbar.height,
      marginBottom: navbar.mb,
      marginTop: navbar.mt,
      paddingBottom: navbar.pb,
      paddingTop: navbar.pt,
      position: 'relative',
      //[theme.breakpoints.down('md')]: {
      //  display: 'none'
      //},
    }),
  );

  if (downMd) {
    return (
      <FlexBox>
        <BrComponent path='header/row3__col1' />
        <BrComponent path='header/navigation' />
        <BrComponent path='menu-container' />
      </FlexBox>
    );
  } else {
    return (
      <NavBarWrapper boxShadow={navbar.elevation}>
        <JustifiedFlexContainer maxWidth={navbar.maxWidth as Breakpoint}>
          <FlexBox sx={{width: 'inherit'}}>
            <BrComponent path='header/row3__col1' />
            <BrComponent path='header/navigation' />
            <BrComponent path='menu-container' />
          </FlexBox>
          <FlexBox>
            <BrComponent path='header/row3__col2' />
          </FlexBox>
          <FlexBox>
            <BrComponent path='header/row3__col3' />
          </FlexBox>
        </JustifiedFlexContainer>
      </NavBarWrapper>
    );
  }
};

export default Navbar;