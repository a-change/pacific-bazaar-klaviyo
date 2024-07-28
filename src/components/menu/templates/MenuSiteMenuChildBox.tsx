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
import React, {useContext, useEffect, useRef, useState} from 'react';
//mui
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//bloomreach sdk
import {BrComponentContext, BrPageContext} from '@bloomreach/react-sdk';
//components
import {SiteMenuChildBox} from '@/components/menu/templates/MenuSiteMenu';
import {MenuContentItem} from '@/components/menu/MenuComponentTypes';
import {FlexRowCenter} from '@/components/common/flex-box';
import {NavLink} from '@/components/common/nav-link';
import {MenuSiteMenuPopover} from '@/components/menu/templates/MenuSiteMenuPopover';
import {MenuSiteCategoryMenuComponent} from '@/components/menu/MenuSiteCategoryMenuComponnet';

export interface MenuSiteMenuChildBoxProps {
  menuItem: MenuContentItem;
  hasChildren: boolean;
  categoryId?: string;
  isDynamicCategory?: boolean;
}

export const MenuSiteMenuChildBox = (props: MenuSiteMenuChildBoxProps) => {
  const {menuItem, hasChildren, categoryId, isDynamicCategory} = props;

  const page = useContext(BrPageContext);
  const component = useContext(BrComponentContext);

  const ref = useRef<HTMLElement>(null);

  const [location, setLocation] = useState(0);
  useEffect(() => {
    setLocation(window.innerWidth / 2 - ref.current.getClientRects()?.[0]?.left);
  }, []);

  const isCategoryMenu = categoryId && !isDynamicCategory;
  return (
    <SiteMenuChildBox style={{zIndex: 2}} ref={ref}>
      <FlexRowCenter alignItems='flex-end' gap={0.3} whiteSpace={'nowrap'}>
        {!hasChildren && menuItem.url ? (
          <NavLink href={menuItem.url ?? ''}>{menuItem.name}</NavLink>
        ) : (
          `${menuItem.name} `
        )}
        {hasChildren && (
          <KeyboardArrowDownIcon sx={{color: 'grey.500', fontSize: '1.1rem'}} />
        )}
        {hasChildren && !isCategoryMenu && (
          <MenuSiteMenuPopover menuItem={menuItem} location={location} />
        )}
        {hasChildren && isCategoryMenu && (
          <MenuSiteCategoryMenuComponent
            {...{
              categoryId,
              pageSize: 32,
              menuItem,
              page,
              component,
              location,
            }}
          />
        )}
      </FlexRowCenter>
    </SiteMenuChildBox>
  );
};