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
import {Badge, Box, Icon, styled, useTheme} from '@mui/material';
//contexts
import {useAppContext} from '@/contexts/AppContext';
//hooks
import useSettings from '@/hooks/useSettings';
import useWindowSize from '@/hooks/useWindowSize';
//components
import {NavLink} from '@/components/common/nav-link';
//Config JSON
import menus from '../../../../mocks/data/menus';

type MobileNavbarProps = {};

const MobileNavbar: FC<MobileNavbarProps> = (): React.ReactElement => {
  const width = useWindowSize();
  const theme = useTheme();
  const {state} = useAppContext();
  const {settings} = useSettings();
  const mobilenavbar = settings.layouts.mobilenavbar;
  const menuitems = menus.mobileNav;

  const Wrapper = styled(Box)(({theme}) => ({
    'backgroundColor': theme.palette.background.paper,
    'bottom': 0,
    'boxShadow': '0px 1px 4px 3px rgba(0, 0, 0, 0.1)',
    'display': 'none',
    'minHeight': mobilenavbar.minHeight,
    'left': 0,
    'justifyContent': 'space-around',
    'pb': mobilenavbar.pb,
    'pt': mobilenavbar.pt,
    'position': 'fixed',
    'right': 0,
    'zIndex': theme.zIndex.drawer + 1,
    '@media only screen and (max-width: 900px)': {
      display: 'flex',
      width: '100vw',
    },
  }));

  const StyledNavLink = styled(NavLink)({
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    fontSize: mobilenavbar.fontSize,
    justifyContent: 'center',
  });

  const iconStyle = {
    display: 'flex',
    marginBottom: '4px',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return width <= theme.breakpoints.values.sm ? (
    <Wrapper>
      {menuitems.map((item) => (
        <StyledNavLink href={item.href ?? ''} key={item.name}>
          {item.name.toLowerCase() === 'cart' ? (
            <Badge
              suppressHydrationWarning={true}
              badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
              color='primary'
            >
              <Icon fontSize='small' sx={iconStyle}>
                {item.icon}
              </Icon>
            </Badge>
          ) : (
            <Icon sx={iconStyle} fontSize='small'>
              {item.icon}
            </Icon>
          )}

          {item.name}
        </StyledNavLink>
      ))}
    </Wrapper>
  ) : null;
};

export default MobileNavbar;
