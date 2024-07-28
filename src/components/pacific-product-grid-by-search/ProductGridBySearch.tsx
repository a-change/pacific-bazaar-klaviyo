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
import React, {useEffect} from 'react';
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {
  ProductGridKeywordInputProps,
  ProductGridKeywordProps,
  withProductGridKeyword,
} from '@/hocs/product/ProductGridKeywordHoc';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
import {ProductGroups} from '@/components/common/product-groups/ProductGroups';
//types
import {SorterOption} from '@/components/common/sorter/SorterTypes';
import {
  ProductGridBySearchComponentParams,
} from '@/components/pacific-product-grid-by-search/ProductGridBySearchComponentTypes';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';

export interface ProductGridBySearchProps {
  productGridBySearchParams: ProductGridBySearchComponentParams;
  groupByOptions: Array<SorterOption>;
  productUrl?: Function;
}

function ProductGridBySearchBase(props: BrProps & GtmEventProps & ProductGridKeywordProps & ProductGridKeywordInputProps & ProductGridBySearchProps) {
  const {
    page,
    loading,
    itemsPageResult,
    error,
    setGtmEventSearch,
    priceRange,
    pageSize,
    query,
    groupBy,
    itemsPageGroupByResult,
    pageNumber,
    groupLimit,
    productGridBySearchParams: {
      template,
      itemsPerRow,
      showTitle,
      showAttributeBadge,
      hideSku,
      showSkuSelect,
      showPagination,
      showFacets,
      facetsLocation,
      //numberOfColumns,
      caption,
      enablePriceRange,
      enablePrecisionMode,
      productUrl,
    },
    groupByOptions,
  } = props;
  const {t} = useTranslation('product');

  const {discoveryDomainKey} = page?.getChannelParameters() ?? {};

  useEffect(() => {
    setGtmEventSearch(query, discoveryDomainKey);
  }, [query, discoveryDomainKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Status loading status={t('loading-search-results')} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (!itemsPageResult && !itemsPageGroupByResult) {
    return <Status warning customMessage={t('no-results-found', {keyword: query})} />;
  }

  if (groupBy) {
    return (
      <ProductGroups
        productGroupsContent={itemsPageGroupByResult}
        priceRange={priceRange}
        productGroupsParams={{
          template: template || 'default',
          title: caption,
          showAttributeBadge,
          hideSorterControls: !showTitle,
          numberOfColumns: itemsPerRow,
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
        }} />
    );
  } else {
    return (
      <ProductGrid
        productGridContent={itemsPageResult}
        priceRange={priceRange}
        productUrl={productUrl}
        productGridParams={{
          template: template || 'default',
          title: caption,
          query,
          showAttributeBadge,
          hideSorterControls: !showTitle,
          numberOfColumns: itemsPerRow,
          pageSize,
          enablePriceRange,
          enablePrecisionMode,
          showFacets,
          facetsLocation,
          hideSku,
          showPagination,
          showSkuSelect,
        }} />
    );
  }
}

export const ProductGridBySearch = withGtmEvent(withProductGridKeyword(ProductGridBySearchBase));
