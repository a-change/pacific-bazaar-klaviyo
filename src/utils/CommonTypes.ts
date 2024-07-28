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

import {ColorOptionsEnum, ImageSizeEnum, LocationEnum} from './CommonEnums';
import {ReactNode} from 'react';
import {SorterOption} from '@/components/common/sorter/SorterTypes';

interface BrBaseSys {
  id: string,
  name: string
}

interface BrComponentSys extends BrBaseSys {
  children: Array<object>,
  componentClass: string,
  label: string,
  links: object,
  meta: object,
  type: string
}

interface BrDocumentSys extends BrBaseSys {
  displayName?: string,
  localeString?: string,
  contentType?: string
}

interface ContentItem {
  id: string,
  name: string,
  label: string,
  type: string,
  locale?: string,
  path?: string,
  fields: Record<string, any>
}

interface CollectionItem {
  content: ContentItem,
  params: Record<string, any>
}


type PacificLink = {
  url: string,
  label?: string,
  isExternal?: boolean,
  openInNewWindow?: boolean,
  color?: ColorOptionsEnum,
  disableElevation?: boolean,
  size?: 'small' | 'medium' | 'large',
  variant?: 'contained' | 'outlined' | 'text'
}

type ImageLink = PacificLink & {
  type: 'internal' | 'external' | 'bynder' | 'unsplash' | 'cloudinary',
  imageSize?: ImageSizeEnum,
  width?: number,
  height?: number,
  fileSize?: number | null
};

// Model for Discovery API response
interface BrSearchResult {
  title: string;
}

// Product
interface BrProduct extends BrSearchResult {
  pid: string;
  sale_price: number;
  price: number;
  sale_price_range: number[];
  price_range: number[];
  description: string;
  description_enh?: string;
  thumb_image: string;
  brand?: string;
  variants: BrProductVariant[];
  sku_color?: string;
  sku_price?: string[];
  sku_sale_price?: string[];
  sku_size?: string;
  inStock?: string;
  onSale?: string;
}

interface BrProductVariant {
  skuid?: string[] | string;
  sku_swatch_images?: string[];
  sku_thumb_images?: string[];
  mainItem?: BrProduct;
  sku_color?: string;
  sku_price?: string[];
  sku_sale_price?: string[];
  sku_size?: string;
}

// Facet
interface BrFacetField {
  key?: string;
  name?: string;
  count?: number;
  // Category facet
  cat_id?: string;
  cat_name?: string;
  parent?: string;
  crumb?: string;
  tree_path?: string;
}

interface BrFacet {
  name?: string;
  type?: string;
  value?: BrFacetField[] | BrStatFacetField;
}

interface BrStatFacetField {
  count?: number;
  start?: number;
  end?: number;
}

// Stats
interface BrStatsField {
  min: number;
  max: number;
}

interface BrStatsFields {
  stats_fields?: Record<string, BrStatsField>;
}

// Article
interface BrArticle extends BrSearchResult {
  image: string;
  introduction: string;
  item_id: string;
  tags: string[];
  url: string;
  xm_primaryDocType: string;
  xm_urls: string[];
}

// Search - Product
interface BrSearchPageHeader {
  canonical_url?: string;
  content_placement_1?: string;
  content_placement_2?: string;
  content_placement_3?: string;
  h1?: string;
  left_nav?: string;
  meta_description?: string;
  meta_keywords?: string;
  robots_meta_tag?: string;
  theme_name?: string;
  title?: string;
}

interface BrSearchResults<T extends BrSearchResult> {
  category_map?: Record<string, string>;
  facet_counts: {
    facet_fields?: Record<string, BrFacetField[]>;
    facets?: BrFacet[];
  };
  response: {
    docs: T[],
    numFound: number,
    start: number
  };
  autoCorrectQuery?: string | null;
  did_you_mean?: (string | null)[] | null;
  stats?: BrStatsFields;
  page_header?: BrSearchPageHeader;
}

// Group by
interface BrGroupByGroupResults<T extends BrSearchResult> {
  doclist: {
    docs: T[];
    maxScore: number;
    numFound: number;
    start: number;
  },
  groupValue: string;
}

interface BrGroupByResult<T extends BrSearchResult> {
  groups: BrGroupByGroupResults<T> [];
  matches: number;
}

interface BrGroupByResults<T extends BrSearchResult> {
  category_map: Record<string, string>;
  facet_counts: {
    facets?: BrFacet[];
    facet_fields?: Record<string, BrFacetField[]>;
  };
  group_response: Record<string, BrGroupByResult<T>>;
  autoCorrectQuery?: string | null;
  did_you_mean?: (string | null)[] | null;
  stats?: BrStatsFields;
}

// Search - Product
interface BrWidgetResults<T extends BrSearchResult> {
  metadata: {
    query: any;
    response: {
      personalized_results: boolean;
      fallback: string;
      recall: string;
    };
    widget: {
      description: string;
      id: string;
      name: string;
      rid: string;
      type: string;
    };
  };
  response: {
    docs: T[],
    numFound: number,
    start: number
  };
}

// Common grid types
type BaseGridParams = {
  showFacets?: boolean;
  facetsLocation?: LocationEnum;
  showPagination?: boolean;
  numberOfColumns?: number;
  pageSize?: number;
  query?: string;
  allowEmptyQuery?: boolean;
}

type BaseProductParams = {
  hideSku?: boolean;
  showSkuSelect?: boolean;
  showAttributeBadge?: boolean;
  productUrl?: Function;
}

type BaseSorterParams = {
  title?: string;
  subTitle?: string;
  titleNode?: ReactNode;
  hideSorterControls?: boolean;
  showGroupBy?: boolean;
  groupBy?: string;
  groupByOptions?: Array<SorterOption>;
  groupLimit?: number;
}

export type {
  BaseGridParams,
  BaseProductParams,
  BaseSorterParams,
  BrArticle,
  BrComponentSys,
  BrDocumentSys,
  BrSearchResult,
  BrProduct,
  BrProductVariant,
  BrFacetField,
  BrStatFacetField,
  BrFacet,
  PacificLink,
  ImageLink,
  BrStatsFields,
  BrStatsField,
  BrSearchResults,
  BrGroupByGroupResults,
  BrGroupByResult,
  BrGroupByResults,
  BrSearchPageHeader,
  BrWidgetResults,
  CollectionItem,
  ContentItem,
};