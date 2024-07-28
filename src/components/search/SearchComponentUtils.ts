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

import {
  AttributeBoostFilter,
  FacetFilter,
  FacetRangeFilter,
  QueryParameterFilter,
  SearchQueryTermFilter,
} from '@/components/search/SearchComponentTypes';
import {getSelectValue} from '@/utils/SelectUtils';

export const getSearchFilters = (filters: Array<any>): Array<SearchQueryTermFilter | AttributeBoostFilter | FacetFilter> | undefined => {
  return filters?.map(filter => {
    const {contentType, facet, facetValue, defaultValue} = filter ?? {};
    switch (contentType) {
      case 'brxsaas:demoQueryTermFilter':
        const {filterPlacement, filterValue, connectionWord} = filter;
        return {
          type: 'queryTerm',
          filterPlacement: getSelectValue(filterPlacement),
          filterValue: getSelectValue(filterValue?.value),
          connectionWord,
        } as SearchQueryTermFilter;
      case 'brxsaas:demoAttributeBoostFilter':
        return {
          type: 'attributeBoost',
          filter: facet && JSON.parse(facet)?.facets?.[0],
          filterValue: getSelectValue(facetValue?.value),
          defaultValue,
        } as AttributeBoostFilter;
      case 'brxsaas:demoFacetFilter':
        return {
          type: 'facet',
          filter: facet && JSON.parse(facet)?.facets?.[0],
          filterValue: getSelectValue(facetValue?.value ?? facetValue?.[0]?.value),
          defaultValue,
        } as FacetFilter;
      case 'brxsaas:demoFacetRangeFilter':
        return {
          type: 'facetRange',
          filter: getSelectValue(facet?.value),
          filterValue: getSelectValue(facetValue?.value),
          defaultValue,
        } as FacetRangeFilter;
      case 'brxsaas:demoQueryParameterFilter':
        const {parameter, parameterValue} = filter;
        return {
          type: 'queryParameter',
          parameter,
          filterValue: getSelectValue(parameterValue?.value),
          defaultValue,
        } as QueryParameterFilter;
    }
  });
};