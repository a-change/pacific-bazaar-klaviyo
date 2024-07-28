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
import {useSearchParams} from 'next/navigation';
//bloomreach sdk
import {Document} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//hocs
import {
  ProductGridCategoryProps,
  ProductsCategoryInputProps,
  withProductGridCategory,
} from '@/hocs/product/ProductGridCategoryHoc';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
import {Status} from '@/components/common/status/Status';
import {ProductGroupsAsSingleList} from '@/components/common/product-groups/ProductGroupsAsSingleList';
//types
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {GtmEventCategory, GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
import {ProductCategoryComponentParamsProps} from '@/components/category/ProductCategoryComponentTypes';
import {ProductGroups} from '@/components/common/product-groups/ProductGroups';
import {SearchProps} from '@/components/search/Search';

function ProductCategoryBase(props: BrProps & GtmEventProps & ProductGridCategoryProps & ProductsCategoryInputProps & ProductCategoryComponentParamsProps & SearchProps) {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    error,
    searchParameters,
    endpoint,
    setGtmEventCategory,
    categoryId,
    banners,
    categoryName,
    priceRange,
    pageSize,
    relatedSearches,
    groupBy,
    groupLimit,
    itemsPageGroupByResult,
    groupByOptions,
    productUrl,
    currentPage,
    contentTitle,
    contentSubTitle,
    caption: customCaption,
    showCaption: showCaptionInput,
    pageNumber,
  } = props;

  const {t} = useTranslation('product');
  const searchParams = useSearchParams();

  const {discoveryApiCallsState: {setDiscoveryApiCalls}} = useContext(UserContext);
  const componentId = component.getId();

  const {document: documentRef} = component.getModels();
  const content = documentRef && page.getContent(documentRef);

  const {discoveryFields} = page!.getChannelParameters();
  const fields = discoveryFields || DEFAULT_BRSM_FIELDS;
  const showSkuSelectDefault = fields.includes(COLORS_ATTRIBUTE) || fields.includes(SIZES_ATTRIBUTE);

  const {title, displayName}: any = content?.getData() || page.getDocument<Document>()?.getData() || {
    title: '',
    displayName: '',
  };

  const params: Record<string, any> = component!.getParameters() || {};
  const {
    template,
    showCaption = showCaptionInput,
    showAttributeBadge,
    hideSku,
    showSkuSelect = showSkuSelectDefault,
    showPagination,
    showFacets,
    facetsLocation,
    numberOfColumns = 4,
    caption,
    message,
    enablePriceRange,
    enablePrecisionMode,
  } = params;

  const category: GtmEventCategory = {
    'catId': categoryId,
    'catName': displayName,
  };

  useEffect(() => {
    setGtmEventCategory(category);
  }, [component]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && !error) {
      setDiscoveryApiCalls({
        componentId,
        apiType: 'category',
        apiCall: {
          endpoint,
          params: new URLSearchParams(searchParameters),
          response: itemsPageResult ?? itemsPageGroupByResult,
        },
      });
    }
  }, [componentId, loading, error, searchParameters, itemsPageResult, itemsPageGroupByResult, endpoint]);// eslint-disable-line react-hooks/exhaustive-deps

  //params.query = category.catId;
  params.categoryDisplayName = title || displayName;

  if (loading) {
    return <Status loading status={'We are fetching category products for you.'} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (groupBy && !itemsPageGroupByResult) {
    return <Status warning customMessage={t('no-results-found', {keyword: categoryName})} />;
  }

  if (!itemsPageResult && !itemsPageGroupByResult) {
    return null;
  }

  const displayTitle = contentTitle || caption || customCaption || message || t('results-for', {keyword: categoryName || searchParams.get('name') || title || displayName});
  const productGridNumberOfColumns = numberOfColumns || 4;

  switch (template) {
    case 'groups-as-single-list':
      if (!groupBy) {
        return <Status warning status={t('group-by-not-provided', {ns: 'search'})} />;
      }
      return <ProductGroupsAsSingleList
        productGroupsContent={itemsPageGroupByResult}
        priceRange={priceRange}
        productGroupsParams={{
          template: 'default',
          title: displayTitle,
          subTitle: contentSubTitle,
          query: 'query',
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
          pageNumber: currentPage,
          groupBy,
          groupByOptions,
          groupLimit,
          showCaption,
          category,
        }} />;
    case 'groups':
      if (!groupBy) {
        return <Status warning status={t('group-by-not-provided', {ns: 'search'})} />;
      }
      return <ProductGroups
        productGroupsContent={itemsPageGroupByResult}
        priceRange={priceRange}
        productGroupsParams={{
          template: 'default',
          title: displayTitle,
          subTitle: contentSubTitle,
          query: 'query',
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
          pageNumber,
          groupBy,
          groupByOptions,
          groupLimit,
          showCaption,
          category,
        }} />;
    default:
      return groupBy ?
        <ProductGroups
          productGroupsContent={itemsPageGroupByResult}
          priceRange={priceRange}
          productGroupsParams={{
            template: 'default',
            title: displayTitle,
            subTitle: contentSubTitle,
            query: 'query',
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
            pageNumber,
            groupBy,
            groupByOptions,
            groupLimit,
            showCaption,
            category,
          }} />
        : (
          <ProductGrid
            productGridContent={itemsPageResult}
            priceRange={priceRange}
            banners={banners}
            relatedSearches={relatedSearches}
            productUrl={productUrl}
            category={category}
            productGridParams={{
              template: template || 'default',
              title: displayTitle,
              subTitle: contentSubTitle,
              showAttributeBadge,
              hideSorterControls: !showCaption,
              pageSize,
              enablePriceRange,
              enablePrecisionMode,
              showFacets,
              facetsLocation,
              hideSku,
              showPagination,
              showSkuSelect,
              numberOfColumns: numberOfColumns || 4,
              groupBy,
              groupLimit,
              groupByOptions,
            }} />
        );
  }
}

export const ProductCategory = withWrapper(withGtmEvent(withProductGridCategory(ProductCategoryBase)));
