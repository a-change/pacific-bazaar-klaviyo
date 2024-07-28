/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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

import {ProductGridTemplateProps} from '@/components/common/product-grid/ProductGridTypes';
import {ArticleGridTemplateProps} from '@/components/common/article-grid/ArticleGridTypes';
import {ProductGroupsTemplateProps} from '@/components/common/product-groups/ProductGroupsTypes';
import {BaseGridParams, BaseProductParams, BaseSorterParams} from '@/utils/CommonTypes';
import {SorterOption} from '@/components/common/sorter/SorterTypes';

type ProductGridTemplate =
  | 'default'
  | 'list'
  | 'groups-as-single-list'
  | 'groups'
  | 'carousel'
  | 'marquee'
  | 'image-list'
  | 'image-list-fullscreen';

type SearchComponentParams = BaseGridParams & BaseProductParams & BaseSorterParams & {
  template: ProductGridTemplate,
  badgeAttribute?: string,
  caption?: string,
  showCaption?: boolean,
  currentPage?: number,
  enablePriceRange?: boolean,
  enablePrecisionMode?: boolean,
  showContent?: boolean,
  widgetId?: string,
  groupLimit?: number,
  groupByOptions?: SorterOption[],
};

type SearchComponentCustomProps = {
  params?: SearchComponentParams,
};

type SearchContentType = {
  products?: ProductGridTemplateProps,
  productGroups?: ProductGroupsTemplateProps,
  articles?: ArticleGridTemplateProps,
}

type SearchTemplateProps = {
  searchContent: SearchContentType,
  searchParams?: SearchComponentParams
}

type SearchFilterBase = {
  type: 'queryTerm' | 'attributeBoost' | 'facet' | 'facetRange' | 'queryParameter',
  filterValue?: string,
  defaultValue?: string
}

type SearchQueryTermFilter = SearchFilterBase & {
  filterPlacement?: 'before' | 'after'
  connectionWord?: string
}

type AttributeBoostFilter = SearchFilterBase & {
  filter?: string
}

type FacetFilter = SearchFilterBase & {
  filter?: string
}

type FacetRangeFilter = SearchFilterBase & {
  filter?: string
}

type QueryParameterFilter = SearchFilterBase & {
  parameter?: string
}

export type {
  SearchTemplateProps,
  ProductGridTemplate,
  SearchComponentParams,
  SearchComponentCustomProps,
  SearchContentType,
  SearchQueryTermFilter,
  AttributeBoostFilter,
  QueryParameterFilter,
  FacetFilter,
  FacetRangeFilter,
};