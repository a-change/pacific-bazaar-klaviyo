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
import React, {useContext, useEffect} from 'react';
//next
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//hocs
import {
  ProductGridKeywordInputProps,
  ProductGridKeywordProps,
  withProductGridKeyword,
} from '@/hocs/product/ProductGridKeywordHoc';
import {ContentSearchProps, withContentSearch} from '@/hocs/content-search/ContentSearchHoc';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//components
import {Status} from '@/components/common/status/Status';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//types
import {SearchTemplateProps} from '@/components/search/SearchComponentTypes';
import {ProductGridTemplate} from '@/components/common/product-grid/ProductGridTypes';
import {SorterOption} from '@/components/common/sorter/SorterTypes';
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
//templates
import {SearchTab} from '@/components/search/templates/SearchTab';

export interface SearchProps {
  groupByOptions: Array<SorterOption>;
  productUrl?: Function;
  banners?: Array<SlotBanner>;
  contentTitle?: string;
  contentSubTitle?: string;
  setCategoryMap?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

function SearchBase(props: BrProps & GtmEventProps & ProductGridKeywordProps & ProductGridKeywordInputProps & ContentSearchProps & SearchTemplateProps & SearchProps) {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    groupBy,
    itemsPageGroupByResult,
    error,
    priceRange,
    pageSize,
    query,
    contentSearchLoading,
    contentSearchResult,
    contentSearchError,
    setGtmEventSearch,
    precisionMode,
    searchParams,
    contentPageSize,
    groupByOptions,
    groupLimit,
    endpoint,
    searchParameters,
    contentEndpoint,
    contentSearchParameters,
    banners,
    contentTitle,
    contentSubTitle,
    setCategoryMap,
    pageNumber,
  } = props;

  const {productUrl} = searchParams;

  const {t} = useTranslation('product');
  const {discoveryApiCallsState: {setDiscoveryApiCalls}} = useContext(UserContext);
  const componentId = component.getId();

  const {
    template,
    showAttributeBadge,
    hideSku,
    showSkuSelect,
    showPagination,
    showFacets,
    facetsLocation,
    caption,
    showCaption,
    enablePriceRange,
    enablePrecisionMode,
    numberOfColumns = 4,
    showContent,
  } = searchParams;

  const productGridNumberOfColumns = numberOfColumns || 4;
  const articleGridNumberOfColumns = numberOfColumns || 2;

  const {discoveryDomainKey} = page?.getChannelParameters() ?? {};

  useEffect(() => {
    setGtmEventSearch(query, discoveryDomainKey);
  }, [query, discoveryDomainKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && !error && !contentSearchLoading && !contentSearchError) {
      setDiscoveryApiCalls({
        componentId,
        apiTypes: ['search', 'content'],
        apiCalls: [
          {
            endpoint,
            params: new URLSearchParams(searchParameters),
            response: itemsPageResult ?? itemsPageGroupByResult,
          },
          {
            endpoint: contentEndpoint,
            params: new URLSearchParams(contentSearchParameters),
            response: contentSearchResult,
          },
        ],
      });
    }
  }, [componentId, loading, error, searchParameters, itemsPageResult, itemsPageGroupByResult, endpoint, contentEndpoint, contentSearchParameters, contentSearchLoading, contentSearchError, contentSearchResult, contentEndpoint]);// eslint-disable-line react-hooks/exhaustive-deps

  if (loading || (showContent && contentSearchLoading)) {
    return <Status container loading status={t('loading-search-results')} />;
  }

  if (error || (showContent && contentSearchError)) {
    return <Status error customMessage={error.message + contentSearchError?.message} />;
  }

  if (groupBy && !itemsPageGroupByResult) {
    return <Status warning customMessage={t('no-results-found', {keyword: query})} />;
  }

  if ((!itemsPageResult && !itemsPageGroupByResult) || (showContent && !contentSearchResult)) {
    return null;
  }

  if (itemsPageResult?.category_map && setCategoryMap) {
    setCategoryMap(itemsPageResult?.category_map);
  }

  const displayTitle = contentTitle || caption;

  let productGridTemplate: ProductGridTemplate;
  switch (template) {
    case 'list':
    case 'groups-as-single-list':
      productGridTemplate = 'list';
      break;
    case 'carousel':
      productGridTemplate = 'carousel';
      break;
    case 'marquee':
      productGridTemplate = 'marquee';
      break;
    case 'image-list':
      productGridTemplate = 'image-list';
      break;
    case 'image-list-fullscreen':
      productGridTemplate = 'image-list-fullscreen';
      break;
    case 'groups':
    case 'default':
    default:
      productGridTemplate = 'default';
      break;
  }

  return (
    <SearchTab searchContent={{
      products: {
        productGridContent: itemsPageResult,
        priceRange,
        precisionMode,
        productUrl,
        banners,
        productGridParams: {
          template: productGridTemplate,
          title: displayTitle,
          showAttributeBadge,
          hideSorterControls: !showCaption && !showContent,
          numberOfColumns: productGridNumberOfColumns,
          pageSize,
          enablePriceRange,
          enablePrecisionMode,
          showFacets,
          facetsLocation,
          hideSku,
          showPagination,
          showSkuSelect,
          query,
          groupBy,
          groupByOptions,
          groupLimit,
          subTitle: contentSubTitle,
        },
      },
      productGroups: {
        productGroupsContent: itemsPageGroupByResult,
        priceRange,
        productGroupsParams: {
          template: 'default', // TODO
          title: displayTitle,
          query,
          showAttributeBadge,
          numberOfColumns: productGridNumberOfColumns,
          showCaption,
          pageSize,
          enablePriceRange,
          enablePrecisionMode,
          showFacets,
          facetsLocation,
          hideSku,
          showPagination,
          showSkuSelect,
          pageNumber,
          groupBy,
          groupByOptions,
          groupLimit,
          productUrl,
        },
      },
      articles: {
        articleGridContent: contentSearchResult,
        articleGridParams: {
          template: 'default',
          title: displayTitle,
          showTitle: true,
          numberOfColumns: articleGridNumberOfColumns,
          pageSize: contentPageSize,
          showFacets,
          facetsLocation,
          showPagination,
          query,
        },
      },
    }}
               searchParams={{
                 template,
                 showContent,
               }} />
  );
}

export const Search = withWrapper(withGtmEvent(withContentSearch(withProductGridKeyword(SearchBase))));
