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
import {Document} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGridBySearch} from '@/components/pacific-product-grid-by-search/ProductGridBySearch';
//types
import {
  ProductGridBySearchComponentCustomProps,
  ProductGridBySearchComponentParams,
} from '@/components/pacific-product-grid-by-search/ProductGridBySearchComponentTypes';
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {SorterOption} from '@/components/common/sorter/SorterTypes';
//functions
import {getFacetFieldFilters, getFacetFilterFromString, getSearchParams} from '@/utils/SearchUtil';
import {getSegmentWithPrefix, UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
import {getGroupByOptions} from '@/components/common/product-groups/ProductGroupsUtils';
import {useTranslation} from 'next-i18next';

export const ProductGridBySearchComponent = (props: BrProps & ProductGridBySearchComponentCustomProps) => {
  const {
    page,
    component,
    params = {},
  } = props;

  const {t} = useTranslation('search');

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ProductGridBySearchComponentParams;

  const {userSegmentState: {userSegment}} = useContext(UserContext)!;
  const useSearchContext = () => useContext(GlobalSearchContext);
  const {globalSearchParams} = useSearchContext()!;

  // TODO: Model the parameters
  const {discoveryFields = DEFAULT_BRSM_FIELDS} = page.getChannelParameters();

  const {
    template = 'default',
    hideSku,
    showSkuSelect = discoveryFields.includes(COLORS_ATTRIBUTE) || discoveryFields.includes(SIZES_ATTRIBUTE),
    enablePriceRange,
    enablePrecisionMode,
    showAttributeBadge,
    widgetId,
    showCaption: showTitle,
    itemsPerRow,
    caption,
    showPagination,
    showFacets,
    facetsLocation,
    numberOfColumns,
    productUrl,
    allowEmptyQuery,
  } = mergedParams;

  const {query: routerQuery} = useRouter();

  let searchParam = getSearchParams(mergedParams, routerQuery);

  let facetFieldFilters = getFacetFieldFilters(routerQuery);

  if (!searchParam.viewId) {
    searchParam.viewId = globalSearchParams.view_id;
  }

  if (!searchParam.segment) {
    searchParam.segment = getSegmentWithPrefix(userSegment?.secondary || userSegment?.primary) || ''; //globalSearchParams.segment;
  }
  if (facetFieldFilters.length === 0 && globalSearchParams.filter) {
    facetFieldFilters = getFacetFilterFromString(globalSearchParams.filter);
  }

  const query = searchParam.query;

  if (!query && !allowEmptyQuery) {
    return <Status container error status={t('search-keyword-not-provided')} />;
  }

  const groupByOptions: Array<SorterOption> = getGroupByOptions(page);

  return <ProductGridBySearch
    {...{
      facetFieldFilters,
    }}
    {...searchParam}
    {...{
      productGridBySearchParams: {
        template,
        itemsPerRow,
        showTitle,
        showAttributeBadge,
        hideSku,
        showSkuSelect,
        showPagination,
        showFacets,
        facetsLocation,
        numberOfColumns,
        caption,
        enablePriceRange,
        enablePrecisionMode,
        productUrl,
      }, groupByOptions,
    }}
    {...props}
  />;
};