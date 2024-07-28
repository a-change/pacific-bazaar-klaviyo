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
import {BrGroupByResults, BrProduct, BrSearchResults} from '@/utils/CommonTypes';
import {FacetFieldFilterInput, PriceRange} from '@/hocs/HocTypes';
import {
  ALGORITHM_COOKIE_MAPPING,
  ALGORITHM_PARAM_NAME,
  DEFAULT_BRSM_FIELDS,
  DEFAULT_STATS_FIELD,
  DEFAULT_UID_COOKIE,
  getDiscoveryEndpoint,
  getSmViewId,
  sortFieldsMapping,
} from '@/hocs/HocUtils';
import {useBrSearch} from '@/hooks/useBrSearch';
import {PrecisionModeType} from '@/components/product/ProductComponentTypes';
import {UID_COOKIE_NAME} from '@/utils/SearchUtil';
import {PreferenceContext} from '@/contexts/PreferenceContext';
import {UserContext} from '@/contexts/UserContext';
import {
  AttributeBoostFilter,
  FacetFilter,
  FacetRangeFilter,
  QueryParameterFilter,
  SearchQueryTermFilter,
} from '@/components/search/SearchComponentTypes';
import {VisitorType} from '@/components/helper/visitor/VisitorHelperTypes';
import {AGGREGATE_PREFIX, ATTRIBUTE_PREFIX, SEGMENTATION_PREFIX} from '@/components/helper/visitor/VisitorHelperUtils';

export interface ProductGridKeywordProps {
  query: string;
  pageSize: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
  sortFields: string;
  setSortFields?: React.Dispatch<React.SetStateAction<string>>;
  groupBy?: string;
  setGroupBy?: React.Dispatch<React.SetStateAction<string>>;
  viewId?: string;
  setViewId?: React.Dispatch<React.SetStateAction<string>>;
  segment?: string;
  setSegment?: React.Dispatch<React.SetStateAction<string | undefined>>;
  widgetId?: string;
  setWidgetId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  error?: Error,
  itemsPageResult?: BrSearchResults<BrProduct>;
  itemsPageGroupByResult?: BrGroupByResults<BrProduct>;
  searchParameters?: string;
  endpoint?: string;
  facetFieldFilters: FacetFieldFilterInput[];
  setFacetFieldFilters?: React.Dispatch<React.SetStateAction<FacetFieldFilterInput[]>>;
  priceRange?: PriceRange;
}

export interface ProductGridKeywordInputProps {
  query: string;
  segment?: string;
  viewId?: string;
  widgetId?: string;
  pageSize?: number;
  pageNumber?: number;
  facetFieldFilters?: FacetFieldFilterInput[];
  sortFields?: string;
  groupBy?: string;
  groupLimit?: number;
  precisionMode?: PrecisionModeType;
  isThematicPage?: boolean;
  searchFilters?: Array<SearchQueryTermFilter | AttributeBoostFilter>;
}

function withProductGridKeywordBase<P extends BrProps>(Component: React.ComponentType<P & ProductGridKeywordProps>) {
  const getFilterKeyValuePair = (filterValue, defaultValue, visitor: VisitorType) => {
    if (!filterValue) {
      return {};
    }

    if (filterValue?.startsWith(SEGMENTATION_PREFIX)) {
      const segment = filterValue.substring(SEGMENTATION_PREFIX.length);
      const segmentValue = visitor?.segmentations?.[segment]?.[0] || defaultValue;
      return {
        key: segment,
        value: segmentValue,
      };
    } else if (filterValue?.startsWith(AGGREGATE_PREFIX)) {
      const aggregate = filterValue.substring(AGGREGATE_PREFIX.length);
      const aggregateValue = visitor?.aggregates?.[aggregate] || defaultValue;
      return {
        key: aggregate,
        value: aggregateValue,
      };
    } else if (filterValue?.startsWith(ATTRIBUTE_PREFIX)) {
      const attribute = filterValue.substring(ATTRIBUTE_PREFIX.length);
      const attributeValue = visitor?.[attribute] || defaultValue;
      return {
        key: attribute,
        value: attributeValue,
      };
    } else {
      return {};
    }
  };

  return (props: P & ProductGridKeywordInputProps) => {
    const {
      page,
      query,
      groupBy,
      groupLimit,
      viewId = '',
      segment,
      widgetId,
      pageSize = 12,
      pageNumber = 1,
      facetFieldFilters = [],
      sortFields = '',
      precisionMode,
      isThematicPage,
      searchFilters,
    } = props;

    const {
      //smEndpoint,
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
    const domainKey = isThematicPage ? 'fossil' : discoveryDomainKey || smDomainKey;
    const accountId = discoveryAccountId || smAccountId;
    const fields = discoveryFields || DEFAULT_BRSM_FIELDS;

    const router = useRouter();
    const [cookies] = useCookies([UID_COOKIE_NAME]);

    let currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath;
    const {previousRoute} = useContext(PreferenceContext);
    const refUrl = process.env.NEXT_PUBLIC_URL + (previousRoute.current || router.asPath);

    const [smViewId, setSmViewId] = useState(viewId);

    const {userState: {user, visitor}, segmentationState: {segmentUpdates}} = useContext(UserContext);

    useEffect(() => {
      setSmViewId(viewId || getSmViewId(props.page!) || '');
    }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps

    let ref = '';
    if (segment) {
      const prefix = 'customer_profile:';
      ref = segment.startsWith(prefix) ? segment.substring(prefix.length) : segment;
    }

    const facetFieldFiltersJson = JSON.stringify(facetFieldFilters);

    let brUid2Cookie;
    if (router.query[ALGORITHM_PARAM_NAME]) {
      const algorithm = router.query[ALGORITHM_PARAM_NAME] as string;
      brUid2Cookie = ALGORITHM_COOKIE_MAPPING[algorithm];
    } else {
      brUid2Cookie = router.query[UID_COOKIE_NAME] || cookies[UID_COOKIE_NAME] || DEFAULT_UID_COOKIE;
    }

    //process the brUid2Cookie value
    /*
    const userSegments = getUserSegments(user);
    const segmentPrefix = 'cdp_segments=';
    const updatedBrUid2Cookie = brUid2Cookie.split(':').map(valuePart => {
      if (valuePart.startsWith(segmentPrefix)) {
        return segmentPrefix + btoa(userSegments);
      } else {
        return valuePart;
      }
    }).join(':');
     */

    // There is a delay for brTrack to update the br_uid_2 cookie value.
    // We are now using the segments captured directly from the update callback.
    // This will keep the search consistent with UI visitor modal.
    // Need to roll back this code and looks like cookie value has been catched up now
    let updatedBrUid2Cookie = brUid2Cookie;

    /*
    if (segmentUpdates.length > 0) {
      const segments = segmentUpdates.map(segmentUpdate => segmentUpdate.segmentation_id + ':' + segmentUpdate.id).join(',')
      const segmentPrefix = 'cdp_segments=';
      updatedBrUid2Cookie = brUid2Cookie.split(':').map(valuePart => {
        if (valuePart.startsWith(segmentPrefix)) {
          return segmentPrefix + btoa(segments);
        } else {
          return valuePart;
        }
      }).join(':');
    }
     */

    //console.log('[EXPONEA]', 'cookies', brUid2Cookie, updatedBrUid2Cookie);

    let filteredQuery = query;
    let boost = '';
    let fq = JSON.parse(facetFieldFiltersJson);

    if (searchFilters && filteredQuery) {
      searchFilters?.filter(searchFilter => !!searchFilter).forEach(searchFilter => {
        const {type} = searchFilter;
        switch (type) {
          case 'queryTerm' :
            const {filterPlacement, filterValue, connectionWord = ''} = searchFilter as SearchQueryTermFilter;
            const {key, value} = getFilterKeyValuePair(filterValue, null, visitor);
            if (key && value) {
              switch (filterPlacement) {
                case 'before':
                  filteredQuery = `${value} ${connectionWord ? connectionWord + ' ' : ''}${filteredQuery === '*' ? '' : filteredQuery}`;
                  break;
                case 'after':
                  filteredQuery = `${filteredQuery === '*' ? '' : filteredQuery} ${connectionWord ? connectionWord + ' ' : ''}${value}`;
                  break;
              }
            }
            break;
          case 'queryParameter' :
            const {
              parameter,
              filterValue: queryParameterValue,
              defaultValue: queryParameterDefault,
            } = searchFilter as QueryParameterFilter;
            if (parameter && queryParameterValue) {
              const {key, value} = getFilterKeyValuePair(queryParameterValue, queryParameterDefault, visitor);
              if (parameter && value) {
                const query = router.query;
                if (query[parameter] !== value) {
                  currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath
                    + (router.asPath.indexOf('?') !== -1 ? '&' : '?')
                    + parameter + '='
                    + encodeURI(value);
                }
              }
            }
            break;
          case 'attributeBoost':
            const {
              filter: attributeBoostFacet,
              filterValue: attributeBoostValue,
              defaultValue: attributeBoostDefault,
            } = searchFilter as AttributeBoostFilter;

            if (attributeBoostFacet && attributeBoostValue) {
              const {key, value} = getFilterKeyValuePair(attributeBoostValue, attributeBoostDefault, visitor);
              if (key && value) {
                boost = `${attributeBoostFacet}:"${value}"`;
              }
            }
            break;
          case 'facet':
            const {
              filter: facet,
              filterValue: facetFilterValue,
              defaultValue: facetDefault,
            } = searchFilter as FacetFilter;

            if (facet && facetFilterValue) {
              let {key, value} = getFilterKeyValuePair(facetFilterValue, facetDefault, visitor);

              if (key && value) {
                const matchedFq = fq?.find(fqItem => fqItem?.id === facet);

                const allValues = [];

                if (Array.isArray(value)) {
                  value.forEach(v => {
                    allValues.push(...[v, v.toUpperCase(), v.toLowerCase()]);
                  });
                } else {
                  allValues.push(...[value, value.toUpperCase(), value.toLowerCase()]);
                }

                const values = [...new Set(allValues)];
                if (matchedFq) {
                  if (!matchedFq.values) {
                    matchedFq.values = [];
                  }
                  values.forEach(v => {
                    if (!matchedFq.values.includes(v)) {
                      matchedFq?.values.push(v);
                    }
                  });
                } else {
                  fq.push({
                    id: facet,
                    values,
                  });
                }
              }
            }
            break;
          case 'facetRange':
            const {
              filter: facetRangeField,
              filterValue: facetRangeFilterValue,
              defaultValue: facetRangeDefault,
            } = searchFilter as FacetRangeFilter;

            const facetRange = facetRangeField ? facetRangeField : DEFAULT_STATS_FIELD;

            if (facetRange && facetRangeFilterValue) {
              let {key, value} = getFilterKeyValuePair(facetRangeFilterValue, facetRangeDefault, visitor);

              if (key && value) {
                let numericNumber = parseFloat(value);
                if (isNaN(numericNumber)) {
                  numericNumber = parseFloat(value.substring(1));
                }
                if (!isNaN(numericNumber)) {
                  const floor = Math.floor(numericNumber / 100) * 100;
                  const ceil = Math.ceil(numericNumber / 100) * 100;
                  value = `[${floor} TO ${ceil}]`;
                }

                const matchedFq = fq?.find(fqItem => fqItem?.id === facetRange);
                if (matchedFq) {
                  if (!matchedFq.values) {
                    matchedFq.values = [];
                  }
                  if (!matchedFq.values.includes(value)) {
                    matchedFq?.values.push(value);
                  }
                } else {
                  fq.push({
                    id: facetRange,
                    values: [value],
                  });
                }
              }
            }
            break;
        }
      });
    }

    const fqJson = JSON.stringify(fq);

    const params = useMemo(
      () => {
        return {
          ...{
            view_id: smViewId,
            widget_id: widgetId,
            account_id: accountId,
            auth_key: authKey,
            domain_key: domainKey,
            segment,
            ref: ref ?? '',
            search_type: 'keyword',
            request_type: isThematicPage ? 'thematic' : 'search',
            url: currentUrl,
            ref_url: refUrl,
            request_id: new Date().getTime(),
            //user_id: userId,
            q: filteredQuery || '*',
            groupby: groupBy,
            group_limit: groupBy ? groupLimit ?? 0 : '',
            fl: fields.split(','),
            fq,
            rows: pageSize,
            sort: sortFieldsMapping[sortFields]!,
            start: pageSize * (pageNumber - 1),
            _br_uid_2: updatedBrUid2Cookie, //brUid2Cookie,
            'stats.field': DEFAULT_STATS_FIELD,
            'query.numeric_precision': precisionMode,
            boost,
          },
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        accountId,
        authKey,
        domainKey,
        smViewId,
        widgetId,
        filteredQuery,
        pageNumber,
        pageSize,
        facetFieldFiltersJson,
        sortFields,
        groupBy,
        groupLimit,
        ref,
        segment,
        fields,
        currentUrl,
        refUrl,
        precisionMode,
        isThematicPage,
        updatedBrUid2Cookie, //brUid2Cookie,
        boost,
        fqJson,
      ],
    );

    // Perform actual search query
    const [results, loading, error, searchParameters] = useBrSearch(endpoint, params);
    let itemsPageResult, itemsPageGroupByResult, priceRange;
    if (!loading && !error && results) {
      if (groupBy) {
        itemsPageGroupByResult = results as BrGroupByResults<BrProduct>;
      } else {
        itemsPageResult = results as BrSearchResults<BrProduct>;
      }
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
          sortFields,
          viewId,
          segment,
          widgetId,
          itemsPageResult,
          itemsPageGroupByResult,
          loading,
          error,
          facetFieldFilters,
          priceRange,
          searchParameters,
          endpoint,
        }}
        {...props}
      />
    );
  };
}

export function withProductGridKeyword<P extends BrProps>(
  Component: React.ComponentType<P & ProductGridKeywordProps>,
) {
  return withProductGridKeywordBase(Component);
}

