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
import {usePathname} from 'next/navigation';
//bloomreach sdk
import {ContainerItem} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {getSegmentWithPrefix, UserContext} from '@/contexts/UserContext';
import {GlobalSearchContext} from '@/contexts/GlobalSearchContext';
//components
import {Status} from '@/components/common/status/Status';
import {ThematicPage} from '@/components/thematic-page/ThematicPage';
//types
import {
  ThematicPageComponentCustomProps,
  ThematicPageComponentParams, ThematicPageTemplateProps,
} from '@/components/thematic-page/ThematicPageComponentTypes';
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {SorterOption} from '@/components/common/sorter/SorterTypes';
//functions
import {
  getFacetFieldFilters,
  getFacetFilterFromString,
  getSearchParams,
  QUERY_PARAM_FACET,
} from '@/utils/SearchUtil';
import {lastSegmentOfUrl} from '@/utils/UrlUtils';
import {getGroupByOptions} from '@/components/common/product-groups/ProductGroupsUtils';

export const ThematicPageComponent = (props: BrProps<ContainerItem> & ThematicPageComponentCustomProps) => {
  const {
    page,
    component,
    params = {},
  } = props;

  const {t} = useTranslation('search');

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ThematicPageComponentParams;

  const {userSegmentState: {userSegment}} = useContext(UserContext)!;
  const {globalSearchParams} = useContext(GlobalSearchContext);

  const {
    allowEmptyQuery,
  } = mergedParams;

  const {query: routerQuery} = useRouter();
  const pathname = usePathname();

  let searchParam = getSearchParams(mergedParams, routerQuery, null, userSegment, globalSearchParams);

  let facetFieldFilters = getFacetFieldFilters(routerQuery, QUERY_PARAM_FACET, globalSearchParams);

  const query = searchParam.query || decodeURIComponent(lastSegmentOfUrl(pathname));
  if (!query && !allowEmptyQuery) {
    return <Status container error status={t('search-keyword-not-provided')} />;
  }

  searchParam.query = query;

  mergedParams.groupByOptions = getGroupByOptions(page);

  return (
    <ThematicPage
      {...{
        facetFieldFilters,
      }}
      {...searchParam}
      isThematicPage
      thematicPageContent={{}}
      thematicPageParams={mergedParams}
      {...{
        page,
        component,
      }} />
  );
};