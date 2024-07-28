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

import {lastSegmentOfUrl} from '@/utils/UrlUtils';
import {getSelectValue} from '@/utils/SelectUtils';
import {BrPage} from '@bloomreach/react-sdk';
import {Page} from '@bloomreach/spa-sdk';

export const getCategoryId = (category: any, asPath: string, alternateCategoryId: string) => {
  let categoryId = category?.categoryid;

  if (categoryId) {
    try {
      let categoryIdFromJson = JSON.parse(categoryId)?.categoryid;
      if (categoryIdFromJson) {
        categoryId = categoryIdFromJson;
      }
    } catch (e) {
    }
  }

  if (!categoryId && alternateCategoryId) {
    categoryId = alternateCategoryId;
  }

  if (!categoryId && (asPath.indexOf('categories') !== -1 || asPath.indexOf('kategorien') !== -1)) {
    categoryId = lastSegmentOfUrl(asPath);
  }

  return categoryId;
};

export const getBanners = (slotBanner: any) => {
  return slotBanner?.map((slotBannerItem: any) => {
    const {banner, slot, textColor, textAlignment, verticalAlignment, proxyProduct} = slotBannerItem;
    // "id=92054;code=57003154"
    const proxyProductId = proxyProduct?.productid;
    let productId;
    if (proxyProductId) {
      const pairs = proxyProductId.split(';')?.[0]?.split('=');
      if (pairs.length == 2) {
        productId = pairs[1];
      }
    }
    return {
      banner,
      slot,
      productId,
      textColor: getSelectValue(textColor),
      textAlignment: getSelectValue(textAlignment),
      verticalAlignment: getSelectValue(verticalAlignment),
    };
  });
};

export const getCategoryUrl = (page: Page, categoryId: string, isDynamic: boolean = false, categoryName: string) => {
  const categoriesPageUrl = '/categories';
  const encodedCategoryId = encodeURIComponent(categoryId);
  return page.getUrl(`${categoriesPageUrl}/${encodedCategoryId}${isDynamic ? '?is_dynamic=true&name=' + encodeURIComponent(categoryName) : ''}`);
};