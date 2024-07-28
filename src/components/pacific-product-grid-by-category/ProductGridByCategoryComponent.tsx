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
//next
import {useRouter} from 'next/router';
//bloomreach sdk
import {ContainerItem} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';//other libs
//contexts
import {getSegmentWithPrefix, UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {Status} from '@/components/common/status/Status';
//functions
import {getFacetFieldFilters, getFacetFilterFromString, getSearchParams} from '@/utils/SearchUtil';
import {lastSegmentOfUrl} from '@/utils/UrlUtils';
//templates
import {ProductGridByCategory} from '@/components/pacific-product-grid-by-category/ProductGridByCategory';

export const ProductGridByCategoryComponent = (props: BrProps) => {
  const {
    page,
    component,
  } = props;

  const {query: routerQuery, asPath} = useRouter();

  // Page Component
  const containerItem = (component as ContainerItem)!;
  const {category, slotBanner, relatedSearch: relatedSearches}: any = containerItem?.getContent(page) ?? {};

  const {userSegmentState: {userSegment}} = useContext(UserContext)!;
  const useSearchContext = () => useContext(GlobalSearchContext);
  const {globalSearchParams} = useSearchContext()!;

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

  // Slot banners
  const banners = slotBanner?.map((slotBannerItem: any) => {
    const {banner, slot, textColor, textAlignment, proxyProduct} = slotBannerItem;
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
      textColor: textColor?.selectionValues?.[0]?.key,
      textAlignment: textAlignment?.selectionValues?.[0]?.key,
    };
  });

  const params = component!.getParameters();
  const template = params?.template || 'default';

  if (!categoryId) {
    categoryId = lastSegmentOfUrl(asPath);
  }

  if (!categoryId) {
    return <Status container error status={'The category page you are looking for has not been configured.'} />;
  }

  let {
    pageSize,
    pageNumber,
    sort,
    segment,
    viewId,
    widgetId,
  } = getSearchParams(params, routerQuery);

  if (!viewId) {
    viewId = globalSearchParams.view_id;
  }

  if (!segment) {
    segment = getSegmentWithPrefix(userSegment?.secondary || userSegment?.primary) || ''; //globalSearchParams.segment;
  }

  let facetFieldFilters = getFacetFieldFilters(routerQuery);

  if (facetFieldFilters.length === 0 && globalSearchParams.filter) {
    facetFieldFilters = getFacetFilterFromString(globalSearchParams.filter);
  }

  return (
    <ProductGridByCategory
      {...{
        categoryId,
        pageNumber,
        pageSize,
        facetFieldFilters,
        segment,
        viewId,
        widgetId,
        sortFields: sort,
        banners,
        relatedSearches,
      }}
      {...props}
    />
  );
};
