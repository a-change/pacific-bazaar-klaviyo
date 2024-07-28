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
import React, {useContext} from 'react';
//mui
import {Grid, List, ListItem, styled, useTheme} from '@mui/material';
//bloomreach sdk
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//components
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {BannerComponent} from '@/components/banner/BannerComponent';
import {SiteMenuListItem, SiteMenuNavLink} from '@/components/menu/templates/MenuSiteMenu';
import {MenuContentItem} from '@/components/menu/MenuComponentTypes';

export const SiteMenuMenusContainer = styled(ListItem, {
  shouldForwardProp: (props) => props !== 'hasBanner' && props !== 'location' && props !== 'isLeft',
})<{hasBanner?: boolean, location: number, isLeft: boolean}>(({theme, hasBanner, location, isLeft}) => {
  const minWidth = hasBanner ? theme.breakpoints.values.md - 50 : 200;
  const halfContainerSize = 1140 / 2;
  let left = isLeft ? 50 : -700;
  if (hasBanner) {
    if (isLeft) {
      if (minWidth - location > halfContainerSize) {
        left -= (minWidth - location - halfContainerSize);
      }
    } else {
      if (minWidth + location > halfContainerSize) {
        left += minWidth + location - halfContainerSize;
      }
    }
  }
  return {
    zIndex: 2,
    top: '100%',
    minWidth,
    left,
    display: 'none',
    position: 'absolute',
    transform: `translate(-10%, 0%)`,
    [theme.breakpoints.down('md')]: {minWidth: 800},
  };
});

export interface MenuSiteMenuPopoverProps {
  menuItem: MenuContentItem;
  location: number;
}

export const MenuSiteMenuPopover = (props: MenuSiteMenuPopoverProps) => {
  const {menuItem, location} = props;

  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);
  const theme = useTheme();
  const isLeft = location > 0;

  return <SiteMenuMenusContainer className='menu-list'
                                 location={location}
                                 isLeft={isLeft}
                                 hasBanner={menuItem.banner?.documentRef || page.isPreview()}>
    <BazaarCard elevation={3} sx={{mt: 1.5, overflow: 'hidden'}}>
      <Grid container>
        {isLeft && <Grid
          item
          md={menuItem.banner?.documentRef || page.isPreview() ? 4 : 12}
          sx={{
            py: 2,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <List>
            {menuItem.childNavItems.map((sub) => {
              return (
                <SiteMenuNavLink href={sub.url ?? ''} key={sub.name}>
                  <SiteMenuListItem sx={{whiteSpace: 'nowrap'}}>{sub.name}</SiteMenuListItem>
                </SiteMenuNavLink>
              );
            })}
          </List>
        </Grid>}
        <Grid item md>
          <BannerComponent
            {...{page, component}}
            documentRef={menuItem.banner?.documentRef ?? ''}
            params={{
              template: 'menu',
              textAlignment: 'center',
              textColor: 'black',
            }}
          />
        </Grid>
        {!isLeft && <Grid
          item
          md={menuItem.banner?.documentRef || page.isPreview() ? 4 : 12}
          sx={{
            py: 2,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <List>
            {menuItem.childNavItems.map((sub) => {
              return (
                <SiteMenuNavLink href={sub.url ?? ''} key={sub.name}>
                  <SiteMenuListItem sx={{whiteSpace: 'nowrap'}}>{sub.name}</SiteMenuListItem>
                </SiteMenuNavLink>
              );
            })}
          </List>
        </Grid>}
      </Grid>
    </BazaarCard>
  </SiteMenuMenusContainer>;
};