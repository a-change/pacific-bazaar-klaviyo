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
import {BrProductVariant} from '@/utils/CommonTypes';

export const COLORS_ATTRIBUTE = 'sku_color';
export const COLORS_DEFAULT_VALUE = 'opaque';
export const SIZES_ATTRIBUTE = 'sku_size';
export const SIZES_DEFAULT_VALUE = 'standard';

const routeConfig = require('@/utils/RouteConfig.json');

export const getProductUrl = (page: Page, productId: string, productCode?: string | null) => {
  const route = routeConfig.product;
  // Work around for bad productCode
  if (productCode && productCode.startsWith('http')) {
    productCode = productId;
  }
  const productPageUrl = `${route}/${productId}___${productCode || ''}`;
  return page.getUrl(productPageUrl);
};

export const getProductIdFromUrl = (onlyId: boolean = false, path: string) => {
  // Take the last segment of
  const pathSegments = path.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  if (lastSegment) {
    const matches = (/\d+___([\d_]+)?$/).exec(lastSegment);
    if (matches && matches.length > 0) {
      if (onlyId) {
        return lastSegment.split('__')[0];
      } else {
        return lastSegment;
      }
    } else {
      return lastSegment.indexOf('___') > -1
        ? lastSegment.split('___')[0]
        : null;
    }
  }
};

export const getSkuColorsOptions = (variants: BrProductVariant[]) => {
  const skuColors = variants
    ?.filter((variantItem) => !!variantItem.sku_color)
    .map((variantItem) => variantItem.sku_color);
  return skuColors?.filter((item, index) => skuColors.indexOf(item) === index) ?? [];
};

export const getSkuSizesOptions = (variants: BrProductVariant[]) => {
  const skuSizes = variants
    ?.filter((variantItem) => !!variantItem.sku_size)
    .map((variantItem) => variantItem.sku_size);
  return skuSizes?.filter((item, index) => skuSizes.indexOf(item) === index) ?? [];
};
