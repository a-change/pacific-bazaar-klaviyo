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

import {FacetListState} from './FacetListTypes';
import {QUERY_PARAM_CONTENT_FACET, QUERY_PARAM_FACET} from '@/utils/SearchUtil';
import {BrFacet, BrFacetField} from '@/utils/CommonTypes';
import {ParsedUrlQuery} from 'querystring';

const config = require('./FacetListConfig.json');

export const getFilteredFacets = (
  facetResult: Record<string, BrFacetField[]>,
  excluded: Array<string>,
): Record<string, BrFacetField[]> => {
  const filteredFacts = {};
  Object.keys(facetResult ?? {}).forEach(key => {
    const facetFields = facetResult[key];
    filterFacets(filteredFacts, facetFields, excluded, key);
  });

  return filteredFacts;
};

export const getFilteredFacetsV2 = (
  facets: BrFacet[],
  excluded: Array<string>,
): Record<string, BrFacetField[]> => {
  const filteredFacts = {};
  facets?.forEach(facet => {
    const {name: key, type, value} = facet;
    if (facet.value && Array.isArray(value)) {
      const facetFields = value as BrFacetField[];
      filterFacets(filteredFacts, facetFields, excluded, key);
    }
  });

  return filteredFacts;
};

const filterFacets = (filteredFacets: Object, facetFields: BrFacetField[], excluded: Array<string>, key: string) => {
  if (facetFields?.length > 0 && excluded.indexOf(key) === -1) {
    filteredFacets[key] = facetFields;
    filteredFacets[key].forEach(facetField => {
      if (facetField.cat_name) {
        const {cat_name, tree_path, parent} = facetField;
        let parentName = parent && tree_path.split('/').find(item => item?.startsWith(parent))?.substring(parent.length + 1);
        const hasDuplicates = facetFields.filter(item => item.cat_name === cat_name).length > 1;
        facetField.name = parentName && hasDuplicates ? `${cat_name} (${parentName})` : cat_name;
      }
      facetField.key = facetField.cat_id ?? facetField.name;
    });
  }
};

export const getFacetsState = (
  filteredFacets: Record<string, BrFacetField[]>,
  selectedFacets: Record<string, BrFacetField[]>,
  numOfDisplayedFacetItems: number,
  numOfOpenedFacets: number,
  enablePriceRange: boolean,
  priceRangeField: string,
  enablePrecisionMode: boolean,
  precisionModeField: string,
): FacetListState => {
  const derivedState: FacetListState = {};
  if (enablePriceRange) {
    derivedState[priceRangeField] = {
      shown: 1,
      max: 1,
      sorting: 'none',
      open: true,
      values: {},
    };
  }

  if (enablePrecisionMode) {
    derivedState[precisionModeField] = {
      shown: 1,
      max: 1,
      sorting: 'none',
      open: true,
      values: {},
    };
  }

  Object.keys(filteredFacets).forEach((key, index) => {
    // This is for handling adding/updating component using CMS console.
    const facetFields = filteredFacets[key];
    const length = facetFields.length;
    if (!derivedState[key]) {
      if (length > 0) {
        derivedState[key] = {
          shown: length > numOfDisplayedFacetItems ? numOfDisplayedFacetItems : length,
          max: length,
          open: index < numOfOpenedFacets,
          sorting: config.sorting?.[key] || 'none',
          values: {},
        };
        facetFields.forEach((value) => {
          derivedState[key].values[value.name] = false;
        });
      } else {
        derivedState[key] = {
          open: false,
          shown: 0,
          max: 0,
          sorting: config.sorting?.[key] || 'none',
          values: {},
        };
      }
    }
  });

  Object.keys(selectedFacets).forEach((key) => {
    const facetFields = selectedFacets[key];
    if (!derivedState[key]) {
      derivedState[key] = {max: 0, open: false, shown: 0, sorting: undefined, values: {}};
    }
    derivedState[key].open = true;
    facetFields.forEach((value) => {
      derivedState[key].values[value.name] = true;
    });
  });
  return derivedState;
};

export const getSelectedFacets = (searchParams: ParsedUrlQuery, isContent: boolean): Record<string, BrFacetField[]> => {
  let selectedFilters = {};

  const facetFilterName = isContent ? QUERY_PARAM_CONTENT_FACET : QUERY_PARAM_FACET;

  const facetFilter = searchParams[facetFilterName];

  let facetFieldFiltersInput = [];
  if (facetFilter) {
    if (Array.isArray(facetFilter)) {
      facetFieldFiltersInput = facetFilter as string[];
    } else {
      facetFieldFiltersInput = [facetFilter as string];
    }
  }

  facetFieldFiltersInput.forEach((categoryParameter) => {
    const pair = categoryParameter.split(':');
    if (pair.length === 2) {
      const category = pair[0].replace(/'/g, '');
      const value = pair[1].replace(/'/g, '');

      const filter = selectedFilters[category];
      const filterValue = {
        key: value,
        name: value,
        count: 0,
      };
      if (filter) {
        filter.push(filterValue);
      } else {
        selectedFilters[category] = [filterValue];
      }
    }
  });

  return selectedFilters;
};
