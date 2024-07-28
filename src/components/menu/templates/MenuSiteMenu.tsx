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
import {Box, Container, ListItem, styled} from '@mui/material';
//bloomreach sdk
//components
import {NavLink} from '@/components/common/nav-link';
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {FlexBox} from '@/components/common/flex-box';
//types
import {MenuTemplateProps} from '@/components/menu/MenuComponentTypes';
//templates
import {MenuSiteMenuChildBox} from '@/components/menu/templates/MenuSiteMenuChildBox';

// const common css style
const navLinkStyle = {
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
  '&:last-child': {marginRight: 0},
};

// style components
export const SiteMenuNavLink = styled(NavLink)({...navLinkStyle});

export const SiteMenuNavBarWrapper = styled(BazaarCard)<{border: number}>(
  ({theme, border}) => ({
    backgroundColor: theme.palette.background.default,
    height: '60px',
    display: 'block',
    borderRadius: '0px',
    position: 'relative',
    marginBottom: '2px',
    ...(border && {borderBottom: `1px solid ${theme.palette.grey[200]}`}),
    [theme.breakpoints.down('md')]: {display: 'none'},
  }),
);

export const SiteMenuInnerContainer = styled(Container)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const SiteMenuChildBox = styled(Box)(({theme}) => ({
  cursor: 'pointer',
  position: 'relative',
  transition: 'color 150ms ease-in-out',
  ':hover': {
    color: theme.palette.primary.main,
    '& .menu-list': {display: 'block'},
  },
}));

export const SiteMenuListItem = styled(ListItem)(({theme}) => ({
  textTransform: 'capitalize',
  padding: '.5rem 2rem',
  ':hover': {backgroundColor: theme.palette.action.hover},
}));

export const MenuSiteMenu = (props: MenuTemplateProps) => {
  const {menuContent: {menuContentItems}} = props;

  return (
    <SiteMenuNavBarWrapper hoverEffect={false} elevation={0} border={0}>
      <SiteMenuInnerContainer disableGutters>
        <FlexBox gap={2}>
          {menuContentItems?.map((menuItem, key) => {
            const categoryId = menuItem.categoryId;
            const isDynamicCategory = menuItem.isDynamicCategory;
            const hasChildren = menuItem.childNavItems && menuItem.childNavItems.length > 0 || (categoryId && !isDynamicCategory);
            return (
              <MenuSiteMenuChildBox menuItem={menuItem} hasChildren={hasChildren} categoryId={categoryId}
                                    isDynamicCategory={isDynamicCategory} key={key} />
            );
          })}
        </FlexBox>
      </SiteMenuInnerContainer>
    </SiteMenuNavBarWrapper>
  );
};
