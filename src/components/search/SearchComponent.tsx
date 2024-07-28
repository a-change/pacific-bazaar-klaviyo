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
import {useTranslation} from 'next-i18next';
//mui
import {BrProps} from '@bloomreach/react-sdk';
//Bloomreach sdks
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {Status} from '@/components/common/status/Status';
import {Search} from '@/components/search/Search';
//types
import {SearchComponentCustomProps, SearchComponentParams} from '@/components/search/SearchComponentTypes';
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {SorterOption} from '@/components/common/sorter/SorterTypes';
//functions
import {
  getFacetFieldFilters,
  getSearchParams,
  QUERY_PARAM_CONTENT_FACET,
  QUERY_PARAM_CONTENT_PAGE_NUM,
  QUERY_PARAM_CONTENT_PAGE_SIZE,
  QUERY_PARAM_CONTENT_SORT,
  QUERY_PARAM_FACET,
} from '@/utils/SearchUtil';
import {getGroupByOptions} from '@/components/common/product-groups/ProductGroupsUtils';
import {getBanners} from '@/components/category/ProductCategoryComponentUtils';
import {getSearchFilters} from '@/components/search/SearchComponentUtils';

export const SearchComponent = (props: BrProps<ContainerItem> & SearchComponentCustomProps) => {
  const {page, component, params} = props;
  const {query: routerQuery} = useRouter();

  const {t} = useTranslation(['search', 'common']);

  // parameters
  const componentParams = component.getParameters();
  const searchComponentParams = {...componentParams, ...params} as SearchComponentParams;

  // models
  const {
    title,
    subTitle: subTitleContent,
    term,
    widget,
    slotBanner,
    filter,
  } = getContainerItemContent<any>(component, page);
  const subTitle = subTitleContent?.value;

  const widgetId = widget?.widgetid;

  const searchFilters = getSearchFilters(filter);

  // Slot banners
  const banners = getBanners(slotBanner);

  const {userSegmentState: {userSegment}} = useContext(UserContext)!;
  const {globalSearchParams} = useContext(GlobalSearchContext);

  // Param values from component/page
  if (searchComponentParams.showSkuSelect === undefined) {
    const {discoveryFields} = page.getChannelParameters();
    const fields = discoveryFields || DEFAULT_BRSM_FIELDS;
    searchComponentParams.showSkuSelect = fields.includes(COLORS_ATTRIBUTE) || fields.includes(SIZES_ATTRIBUTE);
  }

  let {
    sort,
    pageSize,
    pageNumber,
    query: queryInput,
    precisionMode,
    segment,
    viewId,
    groupBy,
    groupLimit,
  } = getSearchParams(searchComponentParams, routerQuery, null, userSegment, globalSearchParams);

  const facetFieldFilters = getFacetFieldFilters(routerQuery, QUERY_PARAM_FACET, globalSearchParams);

  // Groupby options
  const groupByOptions: Array<SorterOption> = searchComponentParams?.groupByOptions ?? getGroupByOptions(page);

  const {showContent, allowEmptyQuery} = searchComponentParams;

  let query = term || queryInput;

  let mock = false;
  if (!query && !allowEmptyQuery) {
    if (page.isPreview()) {
      mock = true;
      query = 'product';
      //return <Status warning status={t('click-here-to-edit-component', {name: 'Search', ns: 'common'})} />;
    } else {
      return <Status container error status={t('search-keyword-not-provided')} />;
    }
  }

  // Content Search Parameters
  const contentPageSizeParam = routerQuery[QUERY_PARAM_CONTENT_PAGE_SIZE];
  const contentPageSize = contentPageSizeParam ? parseInt(contentPageSizeParam as string) : 12;
  const contentCurrentPageParam = routerQuery[QUERY_PARAM_CONTENT_PAGE_NUM];
  const contentPageNumber = contentCurrentPageParam ? parseInt(contentCurrentPageParam as string) : 1;
  const contentSortFields = (routerQuery[QUERY_PARAM_CONTENT_SORT] as string) ?? undefined;
  const contentFacetFieldFilters = getFacetFieldFilters(routerQuery, QUERY_PARAM_CONTENT_FACET);

  return <Search
    {...{
      query,
      pageSize,
      pageNumber,
      facetFieldFilters,
      keyword: showContent ? query : '',
      sortFields: sort,
      contentPageNumber,
      contentPageSize,
      contentSortFields,
      contentFacetFieldFilters,
      precisionMode,
      viewId,
      widgetId,
      segment,
      groupBy,
      groupLimit,
      contentTitle: title,
      contentSubTitle: subTitle,
      banners,
      searchFilters,
    }}
    searchContent={{}}
    searchParams={searchComponentParams}
    {...{groupByOptions}}
    mock={mock}
    {...props} />;
};