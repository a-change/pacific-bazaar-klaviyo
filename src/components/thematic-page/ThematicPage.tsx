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
import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {
  ProductGridKeywordInputProps,
  ProductGridKeywordProps,
  withProductGridKeyword,
} from '@/hocs/product/ProductGridKeywordHoc';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
import {ProductGroups} from '@/components/common/product-groups/ProductGroups';
import {SearchTab} from '@/components/search/templates/SearchTab';
//types
import {ThematicPageContent} from '@/components/thematic-page/templates/ThematicPageContent';
import {ThematicPageTemplateProps} from '@/components/thematic-page/ThematicPageComponentTypes';

function ThematicPageBase(props: BrProps & GtmEventProps & ProductGridKeywordProps & ProductGridKeywordInputProps & ThematicPageTemplateProps) {
  const {
    page,
    loading,
    itemsPageResult,
    error,
    setGtmEventThematic,
    priceRange,
    pageSize,
    query,
    groupBy,
    itemsPageGroupByResult,
    pageNumber,
    groupLimit,
    precisionMode,
    thematicPageParams: {
      template,
      currentPage,
      showAttributeBadge,
      hideSku,
      showSkuSelect,
      showPagination,
      showFacets,
      facetsLocation,
      numberOfColumns,
      caption,
      enablePriceRange,
      enablePrecisionMode,
      productUrl,
      groupByOptions,
      contentLocation = 'top',
    },
  } = props;
  const {t} = useTranslation('product');

  const {discoveryDomainKey} = page?.getChannelParameters() ?? {};

  const pageHeader = itemsPageResult?.page_header;

  useEffect(() => {
    if (pageHeader?.theme_name) {
      setGtmEventThematic(query, discoveryDomainKey, pageHeader.theme_name);
    }
  }, [query, discoveryDomainKey, pageHeader?.theme_name]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Status loading status={t('loading-search-results')} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (!itemsPageResult && !itemsPageGroupByResult) {
    return <Status warning customMessage={t('no-results-found', {keyword: query})} />;
  }

  const productGridNumberOfColumns = numberOfColumns || 4;

  return (
    <Fragment>
      {pageHeader && contentLocation === 'top' && <ThematicPageContent {...pageHeader} />}
      <SearchTab
        searchContent={{
          products: {
            productGridContent: itemsPageResult,
            priceRange,
            precisionMode,
            productGridParams: {
              template: 'default',
              title: caption,
              showAttributeBadge,
              hideSorterControls: false,
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
            },
          },
          productGroups: {
            productGroupsContent: itemsPageGroupByResult,
            priceRange,
            productGroupsParams: {
              template: 'default', // TODO
              title: caption,
              query,
              showAttributeBadge,
              numberOfColumns: productGridNumberOfColumns,
              pageSize,
              enablePriceRange,
              enablePrecisionMode,
              showFacets,
              facetsLocation,
              hideSku,
              showPagination,
              showSkuSelect,
              pageNumber: currentPage, //TODO:
              groupBy,
              groupByOptions,
              groupLimit,
            },
          },
        }}
        searchParams={{
          template: 'default',
          showContent: false,
        }}
      />
      {pageHeader && contentLocation === 'bottom' && <ThematicPageContent {...pageHeader} />}
    </Fragment>
  );
}

export const ThematicPage = withGtmEvent(withProductGridKeyword(ThematicPageBase));
