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

import {Page} from '@bloomreach/spa-sdk';
import {BrFacetField} from '@/utils/CommonTypes';
import {
  CategoryNavigatorContentType,
  CategoryNavigatorItem,
} from '@/components/category-navigator/CategoryNavigatorComponentTypes';

export const getCategoryNavigatorContent = (label: string, facets: BrFacetField[], page: Page, categoryUrlFunc: Function, numberOfItems: number = 10, dynamicCategories = null): CategoryNavigatorContentType => {
  const dynamicCategoryUrl = (id: string, name: string) => {
    let url = page.getUrl(`/categories/${id}`);
    const separator = url.indexOf('?') !== -1 ? '&' : '?';
    return `${url}${separator}name=${name}&is_dynamic=true`;
  };

  const dynamicCategoryItems: Array<CategoryNavigatorItem> = dynamicCategories ? dynamicCategories?.split(',').map(dynamicCategory => {
    const labelIdPair = dynamicCategory.split(':');
    const id = labelIdPair?.[1]?.trim();
    const name = labelIdPair?.[0]?.trim();
    return {
      name,
      id,
      url: dynamicCategoryUrl(id, name),
      isDynamic: true,
    };
  }) : [];

  let childCategoryItems: Array<CategoryNavigatorItem> = facets?.filter(facet => facet.parent === '').map(facet => {
    const {cat_name, cat_id, count} = facet;
    return {
      name: cat_name,
      count,
      id: cat_id,
      url: categoryUrlFunc(facet),
      childCategoryItems: facets?.filter(facet => facet.parent === cat_id).map(facet => {
        const {cat_name, cat_id, count} = facet;
        return {
          name: cat_name,
          count,
          id: cat_id,
          url: categoryUrlFunc(facet),
        };
      }).slice(0, numberOfItems * 2),
    };
  }).slice(0, numberOfItems);

  if (process.env.NEXT_PUBLIC_DYNAMIC_CATEGORIES_ENABLED === 'true' && dynamicCategoryItems && dynamicCategoryItems.length > 0) {
    childCategoryItems.push({
      name: '',
      id: '',
    });
    childCategoryItems = childCategoryItems.concat(dynamicCategoryItems);
  }

  return {
    categoryItem: {
      name: label,
      id: '',
      childCategoryItems,
    },
  };
};