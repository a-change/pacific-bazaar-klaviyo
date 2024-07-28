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
//hocs
import {
  ProductGridKeywordInputProps,
  ProductGridKeywordProps,
  withProductGridKeyword,
} from '@/hocs/product/ProductGridKeywordHoc';
//contexts
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {Status} from '@/components/common/status/Status';
//types
import {CategoryNavigatorTemplateProps} from '@/components/category-navigator/CategoryNavigatorComponentTypes';
import {BrFacetField, BrProduct} from '@/utils/CommonTypes';
//functions
import {getCategoryNavigatorContent} from '@/components/category-navigator/CategoryNavigatorComponentUtils';
//templates
import {CategoryNavigatorDefault} from '@/components/category-navigator/templates';
import {getCategoryUrl} from '@/components/category/ProductCategoryComponentUtils';

function CategoryNavigatorBase(props: BrProps & ProductGridKeywordProps & ProductGridKeywordInputProps & CategoryNavigatorTemplateProps) {
  const {
    page,
    loading,
    itemsPageResult,
    error,
    categoryNavigatorParams,
  } = props;
  const {label, numberOfItems, dynamicCategories} = categoryNavigatorParams;
  const {categoryNavigators, setCategoryNavigators} = useContext(GlobalSearchContext);
  const channelId = usePathname()?.split('/')?.[1];

  const getCategoryNavigators = () => {
    let rawCategories: BrFacetField[] = [];
    if (itemsPageResult?.facet_counts?.facet_fields) {
      rawCategories = itemsPageResult?.facet_counts?.facet_fields?.category ?? [];
    } else {
      const value = itemsPageResult?.facet_counts?.facets.find(facet => facet.name === 'category')?.value;
      if (value && Array.isArray(value)) {
        rawCategories = value as BrFacetField[];
      }
    }
    const categoryUrlFunc = (facet: BrFacetField) => getCategoryUrl(page, facet.cat_id, false, facet.cat_name);
    const categoryNavigatorContent = getCategoryNavigatorContent(label, rawCategories, page, categoryUrlFunc, numberOfItems, dynamicCategories);

    return {
      categoryNavigatorParams,
      categoryNavigatorContent,
    };
  };

  useEffect(() => {
    if (!loading && !error && itemsPageResult && !categoryNavigators?.[channelId]) {
      const updatedCategoryNavigators = {};
      updatedCategoryNavigators[channelId] = getCategoryNavigators();
      setCategoryNavigators(updatedCategoryNavigators);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, loading, error, itemsPageResult]);

  if (loading) {
    return null;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if ((!itemsPageResult)) {
    return null;
  }

  return (
    <CategoryNavigatorDefault
      {...getCategoryNavigators()}
    />
  );
}

export const CategoryNavigator = withProductGridKeyword(CategoryNavigatorBase);
