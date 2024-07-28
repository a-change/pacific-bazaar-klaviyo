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
import {Box, Grid, List, ListItem, styled} from '@mui/material';
//components
import {NavLink} from '@/components/common/nav-link';
//types
import {MenuTemplateProps} from '@/components/menu/MenuComponentTypes';
//Custom styled components
const navLinkStyle = {
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
  '&:last-child': {marginRight: 0},
};

const StyledNavLink = styled(NavLink)({...navLinkStyle});

const MenuListItem = styled(ListItem)(({theme}) => ({
  padding: '.5rem 0',
  ':hover': {backgroundColor: theme.palette.action.hover},
}));

export const MenuBox = styled(Box)(({theme}) => ({
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: 1.5,
  lineHeight: 1,
}));

export const MenuMultiColumnVertical = (props: MenuTemplateProps) => {
  const {menuContent: {name, menuContentItems}} = props;
  const gridSize = 12 / menuContentItems.length;
  return <Grid container spacing={3}>
    {menuContentItems.map((menuItem, key) =>
      <Grid item lg={gridSize} md={6} sm={6} xs={12} key={key}>
        <MenuBox>
          {menuItem.name}
        </MenuBox>
        <List>
          {menuItem?.childNavItems?.map((childNavItem, key2) => {
            return childNavItem?.url ? (
              <StyledNavLink href={childNavItem.url ?? ''} key={key2}>
                <MenuListItem>{childNavItem.name}</MenuListItem>
              </StyledNavLink>
            ) : (
              <MenuListItem key={key2}>{childNavItem.name}</MenuListItem>
            );
          })}
        </List>
      </Grid>)}
  </Grid>;
};
