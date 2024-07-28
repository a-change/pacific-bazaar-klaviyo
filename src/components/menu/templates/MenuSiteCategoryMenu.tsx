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
import React, {useContext, useEffect} from 'react';
//next
import {usePathname} from 'next/navigation';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//hocs
import {
  ProductGridCategoryProps,
  ProductsCategoryInputProps,
  withProductGridCategory,
} from '@/hocs/product/ProductGridCategoryHoc';
//types
import {MenuContentItem} from '@/components/menu/MenuComponentTypes';
//templates
import {MenuSiteCategoryMenuDefault} from '@/components/menu/templates/MenuSiteCategoryMenuDefault';

export interface MenuSiteCategoryMenuProps {
  menuItem: MenuContentItem;
  location?: number;
}

function MenuSiteCategoryMenuBase(props: BrProps & ProductGridCategoryProps & ProductsCategoryInputProps & MenuSiteCategoryMenuProps) {
  const {
    page,
    component,
    menuItem,
    pageSize,
    categoryId,
    itemsPageResult,
    loading,
    error,
    location,
  } = props;
  const {menuCategories, setMenuCategories} = useContext(GlobalSearchContext);
  const channelId = usePathname()?.split('/')?.[1];

  useEffect(() => {
    const key = `${channelId}-${categoryId}`;
    if (!loading && !error && itemsPageResult && !menuCategories?.[key]) {
      const updatedMenuCategories = {};
      updatedMenuCategories[key] = itemsPageResult;
      setMenuCategories(updatedMenuCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, loading, error, itemsPageResult]);

  if (loading || error || !itemsPageResult) {
    return null;
  }

  return <MenuSiteCategoryMenuDefault {...{
    page,
    component,
    categoryId,
    pageSize,
    menuItem,
    itemsPageResult,
    location,
  }} />;
}

export const MenuSiteCategoryMenu = withProductGridCategory(MenuSiteCategoryMenuBase);

