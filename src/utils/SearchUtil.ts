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

import {ParsedUrlQuery} from 'querystring';
import {FacetFieldFilterInput} from '@/hocs/HocTypes';
import {PrecisionModeType} from '@/components/product/ProductComponentTypes';
import {getSegmentWithPrefix, UserSegmentType} from '@/contexts/UserContext';

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 12;

export const PARAM_PAGE_SIZE = 'pageSize';
export const PARAM_CURRENT_PAGE = 'currentPage';
export const PARAM_SORT_FIELDS = 'sortFields';
export const PARAM_SHOW_CAPTION = 'showCaption';
export const PARAM_SHOW_CONTENT = 'showContent';
export const PARAM_SHOW_SWITCHBOARD = 'showSwitchboard';
export const PARAM_SHOW_PAGINATION = 'showPagination';
export const PARAM_SHOW_FACETS = 'showFacets';
export const PARAM_NUMBER_OF_COLUMNS = 'numberOfColumns';
export const PARAM_FACETS_LOCATION = 'facetsLocation';
export const PARAM_WIDGET_ID = 'widgetId';

export const QUERY_PARAM_QUERY = '_sq';

export const QUERY_PARAM_GROUP_BY = 'groupby';
export const QUERY_PARAM_GROUP_LIMIT = 'group_limit';

export const QUERY_PARAM_FACET = '_sfq';
export const QUERY_PARAM_CONTENT_FACET = '_csfq';

export const QUERY_PARAM_PAGE_SIZE = '_sps';
export const QUERY_PARAM_CONTENT_PAGE_SIZE = '_csps';

export const QUERY_PARAM_SORT = 'sort';
export const QUERY_PARAM_CONTENT_SORT = 'csort';

export const QUERY_PARAM_PAGE_NUM = 'page';
export const QUERY_PARAM_CONTENT_PAGE_NUM = '_cspage';

export const QUERY_PARAM_ACTIVE_TAB = 'active';

export const QUERY_PARAM_SEGMENT = 'segment';
export const QUERY_PARAM_VIEW_ID = 'view_id';

export const UID_COOKIE_NAME = '_br_uid_2';

export const QUERY_PARAM_PRECISION_MODE = 'query.numeric_precision';

export const QUERY_PARAM_SWITCHBOARD = 'switchboard';

export interface SearchParam {
  pageNumber: number;
  pageSize: number;
  sort: string;
  segment?: string | null;
  viewId?: string;
  query: string;
  groupBy?: string;
  widgetId?: string;
  groupLimit?: number;
  precisionMode?: PrecisionModeType;
}

const config = require('./SearchConfig.json');

export const getSearchParam = (
  params: Partial<Record<string, string | number | boolean>>,
  routerQuery: ParsedUrlQuery,
  defaultSearchParam?: SearchParam,
  queryType?: string,
): SearchParam => {
  const queryParameters = routerQuery;
  const queryParameterNames = queryType
    ? config.queryParameters[queryType]
    : config.queryParameters.default;

  let pageSize: number = defaultSearchParam?.pageSize ?? DEFAULT_PAGE_SIZE;
  if (params[PARAM_PAGE_SIZE]) {
    pageSize = parseInt(params[PARAM_PAGE_SIZE]! as string);
  }
  if (queryParameters[queryParameterNames.pageSize]) {
    pageSize = parseInt(queryParameters[queryParameterNames.pageSize]! as string);
  }

  let pageNumber: number = defaultSearchParam?.pageNumber ?? DEFAULT_PAGE_NUMBER;
  if (params[PARAM_CURRENT_PAGE]) {
    pageNumber = parseInt(params[PARAM_CURRENT_PAGE]! as string);
  }
  if (queryParameters[queryParameterNames.pageNumber]) {
    pageNumber = parseInt(queryParameters[queryParameterNames.pageNumber]! as string);
  }

  const sort =
    (queryParameters[queryParameterNames.sort] as string) || defaultSearchParam?.sort || '';

  const searchParam: SearchParam = {
    pageNumber,
    pageSize,
    sort,
    query: '',
  };

  const segment = queryParameters[QUERY_PARAM_SEGMENT] || defaultSearchParam?.segment;
  if (segment) {
    searchParam.segment = segment as string;
  }

  const viewId = queryParameters[QUERY_PARAM_VIEW_ID] || defaultSearchParam?.viewId;
  if (segment) {
    searchParam.viewId = viewId as string;
  }

  const query = queryParameters[QUERY_PARAM_QUERY] || defaultSearchParam?.query;
  if (query) {
    searchParam.query = query as string;
  }

  const groupBy = queryParameters[QUERY_PARAM_GROUP_BY] || defaultSearchParam?.groupBy;
  if (groupBy) {
    searchParam.groupBy = groupBy as string;
  }

  let groupLimit = queryParameters[QUERY_PARAM_GROUP_LIMIT] || defaultSearchParam?.groupLimit;
  if (groupLimit) {
    searchParam.groupLimit = parseInt(groupLimit as string);
  }

  if (params[PARAM_WIDGET_ID]) {
    searchParam.widgetId = params[PARAM_WIDGET_ID] as string;
  }

  searchParam.precisionMode = (queryParameters[QUERY_PARAM_PRECISION_MODE] as PrecisionModeType) || defaultSearchParam.precisionMode;

  return searchParam;
};

export const getFacetFieldFilters = (routerQuery: ParsedUrlQuery, paramName: string = QUERY_PARAM_FACET, globalSearchParams?: any): FacetFieldFilterInput[] => {
  const queryParameters = routerQuery;
  let facetFieldFilters: FacetFieldFilterInput[] = [];
  let facetFieldFiltersInput =
    (Array.isArray(queryParameters[paramName])
      ? (queryParameters[paramName] as string[])
      : ([queryParameters[paramName]] as string[])) ?? [];

  if (facetFieldFiltersInput.length > 0) {
    facetFieldFiltersInput.forEach((facetItem) => {
      prepareFilterInputs(facetItem, facetFieldFilters);
    });
  }

  if (facetFieldFilters.length === 0 && globalSearchParams?.filter) {
    facetFieldFilters = getFacetFilterFromString(globalSearchParams?.filter);
  }
  return facetFieldFilters;
};

export const getFacetFilterFromString = (filterValues: string): FacetFieldFilterInput[] => {
  const facetFieldFilters: FacetFieldFilterInput[] = [];
  filterValues.split(',').forEach((filterValue) => {
    prepareFilterInputs(filterValue, facetFieldFilters);
  });
  return facetFieldFilters;
};

const prepareFilterInputs = (filterValue: string, facetFieldFilters: FacetFieldFilterInput[]) => {
  const facet = getFacetFilterFilter(filterValue);
  if (facet) {
    const {facetItemId, facetItemValue} = facet;
    const matchedFacetFieldFilter = facetFieldFilters.find(
      (facetFieldFilter: any) => facetFieldFilter?.id === facetItemId,
    );
    if (matchedFacetFieldFilter) {
      matchedFacetFieldFilter?.values?.push(facetItemValue);
    } else {
      facetFieldFilters.push({
        id: facetItemId,
        values: [facetItemValue],
      });
    }
  }
};

export const getFacetFilterFilter = (filterValue: string) => {
  const facetItemSegments = filterValue?.split(':') ?? [];
  if (facetItemSegments.length === 2) {
    const facetItemId = facetItemSegments[0];
    const facetItemValue = facetItemSegments[1].substring(1, facetItemSegments[1].length - 1);
    return {
      facetItemId,
      facetItemValue,
    };
  }
  return null;
};

export const processUidCookie = (uidCookie: any, hasExponeaProjectToken: boolean) => {
  if (hasExponeaProjectToken || !uidCookie) {
    return uidCookie;
  }

  return uidCookie.split(':')
    .filter((segment: any) => !segment.startsWith('cdp_segments'))
    .join(':');
};

export const SEGMENT_PARAM_NAME = 'seg';
export const AFFINITY_PARAM_NAME = 'lvl';

export const SEGMENT_SAAS_PARAM_NAME = 'btm_segment';
export const CAMPAIGN_PARAM_NAME = 'btm_campaign_id';

export const isSaas = (): boolean => {
  const brBaseUrl: string = process.env.NEXT_PUBLIC_BRXM_ENDPOINT!;
  return brBaseUrl.indexOf('delivery/site') !== -1;
};

// Component parameters -> search parameters -> default values
export const getSearchParams = (params: any, routerQuery: ParsedUrlQuery, queryType?: string, userSegment?: Partial<UserSegmentType>, globalSearchParams?: any): SearchParam => {
  const queryParameterNames = queryType ? config.queryParameters[queryType] : config.queryParameters.default;

  let pageSize: number = DEFAULT_PAGE_SIZE;
  if (params[PARAM_PAGE_SIZE]) {
    pageSize = parseInt(params[PARAM_PAGE_SIZE]! as string);
  }
  if (routerQuery[queryParameterNames.pageSize]) {
    pageSize = parseInt(routerQuery[queryParameterNames.pageSize] as string);
  }

  let pageNumber: number = DEFAULT_PAGE_NUMBER;
  if (params[PARAM_CURRENT_PAGE]) {
    pageNumber = parseInt(params[PARAM_CURRENT_PAGE] as string);
  }
  if (routerQuery[queryParameterNames.pageNumber]) {
    pageNumber = parseInt(routerQuery[queryParameterNames.pageNumber]! as string);
  }

  let sort = '';
  if (params[PARAM_SORT_FIELDS]) {
    sort = params[PARAM_SORT_FIELDS] as string;
  }
  if (routerQuery[queryParameterNames.sort]) {
    sort = routerQuery[queryParameterNames.sort] as string;
  }

  let query = '';
  if (params['query']) {
    query = params.query as string;
  }
  if (routerQuery[QUERY_PARAM_QUERY]) {
    query = routerQuery[QUERY_PARAM_QUERY] as string;
  }

  const searchParam: SearchParam = {
    pageNumber,
    pageSize,
    sort,
    query,
  };

  if (routerQuery[QUERY_PARAM_SEGMENT]) {
    searchParam.segment = routerQuery[QUERY_PARAM_SEGMENT] as string;
  }

  if (routerQuery[QUERY_PARAM_VIEW_ID]) {
    searchParam.viewId = routerQuery[QUERY_PARAM_VIEW_ID] as string;
  }

  const groupBy = routerQuery[QUERY_PARAM_GROUP_BY] || params.groupBy;
  if (groupBy) {
    searchParam.groupBy = groupBy === 'none' ? '' : groupBy as string;
  }

  let groupLimit = routerQuery[QUERY_PARAM_GROUP_LIMIT] || params.groupLimit;
  if (groupLimit) {
    searchParam.groupLimit = parseInt(groupLimit as string);
  }

  if (params[PARAM_WIDGET_ID]) {
    searchParam.widgetId = params[PARAM_WIDGET_ID] as string;
  }

  searchParam.precisionMode = (routerQuery[QUERY_PARAM_PRECISION_MODE] as PrecisionModeType) || 'standard';

  if (!searchParam.viewId) {
    searchParam.viewId = globalSearchParams?.view_id;
  }

  if (!searchParam.segment) {
    searchParam.segment = globalSearchParams?.segment || getSegmentWithPrefix(userSegment?.secondary || userSegment?.primary) || '';
  }

  return searchParam;
};

