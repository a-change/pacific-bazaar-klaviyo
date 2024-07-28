/* eslint-disable react/display-name */
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

import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/router';
import {BrProps} from '@bloomreach/react-sdk';
import {useBrSearch} from '@/hooks/useBrSearch';
import {
  DEFAULT_BRSM_FIELDS,
  DEFAULT_STATS_FIELD,
  DEFAULT_UID_COOKIE,
  getDiscoveryEndpoint,
  getSmViewId,
  sortFieldsMapping,
  UID_COOKIE_NAME,
} from '@/hocs/HocUtils';
import {BrGroupByResults, BrProduct, BrSearchResults} from '@/utils/CommonTypes';
import {FacetFieldFilterInput, PriceRange} from '@/hocs/HocTypes';
import {PreferenceContext} from '@/contexts/PreferenceContext';

export interface ProductGridCategoryProps {
  categoryName?: string;
  pageSize: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
  sortFields: string;
  setSortFields?: React.Dispatch<React.SetStateAction<string>>;
  viewId?: string;
  setViewId?: React.Dispatch<React.SetStateAction<string>>;
  segment?: string;
  setSegment?: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  error?: Error,
  itemsPageResult?: BrSearchResults<BrProduct>;
  searchParameters?: string;
  endpoint?: string;
  facetFieldFilters: FacetFieldFilterInput[];
  setFacetFieldFilters?: React.Dispatch<React.SetStateAction<FacetFieldFilterInput[]>>;
  priceRange?: PriceRange;
  groupBy?: string;
  setGroupBy?: React.Dispatch<React.SetStateAction<string>>;
  itemsPageGroupByResult?: BrGroupByResults<BrProduct>;
}

export interface ProductsCategoryInputProps {
  categoryId: string;
  segment?: string;
  viewId?: string;
  pageSize?: number;
  pageNumber?: number;
  facetFieldFilters?: FacetFieldFilterInput[];
  sortFields?: string;
  widgetId?: string;
  groupBy?: string;
  groupLimit?: number;
  isDynamic?: boolean;
}

function withProductGridCategoryBase<P extends BrProps>(Component: React.ComponentType<P & ProductGridCategoryProps>) {
  return (props: P & ProductsCategoryInputProps) => {
    const {
      page,
      categoryId,
      viewId = '',
      widgetId = '',
      segment,
      pageSize = 12,
      pageNumber = 1,
      facetFieldFilters = [],
      sortFields = '',
      groupBy,
      groupLimit,
      isDynamic,
    } = props;

    const {
      smEndpoint,
      discoveryRealm,
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryAccountId,
      discoveryFields,
      smAuthKey,
      smDomainKey,
      smAccountId,
    } = page!.getChannelParameters();

    const endpoint = getDiscoveryEndpoint(discoveryRealm);
    const authKey = discoveryAuthKey || smAuthKey;
    const domainKey = discoveryDomainKey || smDomainKey;
    const accountId = discoveryAccountId || smAccountId;
    const fields = discoveryFields || DEFAULT_BRSM_FIELDS;

    const [smViewId, setSmViewId] = useState('');
    const router = useRouter();
    const [cookies] = useCookies([UID_COOKIE_NAME]);
    const currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath;

    const {previousRoute} = useContext(PreferenceContext);
    const refUrl = process.env.NEXT_PUBLIC_URL + (previousRoute.current || router.asPath);

    useEffect(() => {
      setSmViewId(viewId || getSmViewId(props.page!) || '');
    }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps

    const {query/*, groupBy*/} = useMemo(() => {
      const search = router.query;
      return {
        query: (search['q'] as string) ?? (search['cid'] as string) ?? categoryId,
        //groupBy: search['groupby'],
      };
    }, [router.query, categoryId]);

    const facetFieldFiltersJson = JSON.stringify(facetFieldFilters);
    const uidCookie = cookies[UID_COOKIE_NAME];

    const params = useMemo(
      () => {
        return {
          view_id: viewId,
          widget_id: widgetId,
          account_id: accountId,
          auth_key: authKey,
          domain_key: domainKey,
          search_type: 'category',
          request_type: 'search',
          url: currentUrl,
          ref_url: refUrl,
          request_id: new Date().getTime(),
          //widget_id: widgetId || widget?.[searchType],
          //user_id: userId,
          q: query,
          groupby: groupBy,
          group_limit: groupBy ? groupLimit ?? 0 : '',
          fl: fields.split(','),
          fq: JSON.parse(facetFieldFiltersJson),
          rows: pageSize,
          sort: sortFieldsMapping[sortFields]!,
          start: pageSize * (pageNumber - 1),
          _br_uid_2: uidCookie || DEFAULT_UID_COOKIE,
          'stats.field': DEFAULT_STATS_FIELD,
          category_type: isDynamic ? 'dynamic' : null,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        uidCookie,
        accountId,
        authKey,
        domainKey,
        viewId,
        query,
        groupBy,
        pageNumber,
        pageSize,
        facetFieldFiltersJson,
        sortFields,
        widgetId,
        groupLimit,
        currentUrl,
        refUrl,
      ]);

    // Perform actual search query
    const [results, loading, error, searchParameters] = useBrSearch(endpoint, params);
    let itemsPageResult, itemsPageGroupByResult, categoryName, priceRange;
    if (!loading && !error && results) {
      if (groupBy) {
        itemsPageGroupByResult = results as BrGroupByResults<BrProduct>;
      } else {
        itemsPageResult = results as BrSearchResults<BrProduct>;
      }
      const {
        category_map: categoryMap,
        //response: {numFound, start, docs},
        //facet_counts,
      } = results;

      categoryName = categoryMap?.[categoryId];

      const priceRangeFieldStats = results?.stats?.stats_fields?.[DEFAULT_STATS_FIELD];
      priceRange = priceRangeFieldStats ? {
        priceMin: priceRangeFieldStats?.min,
        priceMax: priceRangeFieldStats?.max,
      } : undefined;
    }

    return (
      <Component
        {...{
          pageSize,
          pageNumber,
          viewId,
          segment,
          sortFields,
          itemsPageResult,
          itemsPageGroupByResult,
          facetFieldFilters,
          categoryName,
          priceRange,
          loading,
          error,
          searchParameters,
          endpoint,
        }}
        {...props}
      />
    );
  };
}

export function withProductGridCategory<P extends BrProps>(
  Component: React.ComponentType<P & ProductGridCategoryProps>,
) {
  return withProductGridCategoryBase(Component);
}
