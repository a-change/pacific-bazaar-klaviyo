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
//next
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {Document} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {
  ProductGridCategoryProps,
  ProductsCategoryInputProps,
  withProductGridCategory,
} from '@/hocs/product/ProductGridCategoryHoc';
//components
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
import {Status} from '@/components/common/status/Status';
//types
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {GtmEventCategory, GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';

export interface SlotBanner {
  banner?: any;
  slot?: number;
  productId?: string;
  textColor?: string;
  textAlignment?: string;
  verticalAlignment?: string;
}

export interface SlotBannersProps {
  banners?: Array<SlotBanner>;
  relatedSearches?: Array<string>;
}

function ProductGridByCategoryBase(props: BrProps & GtmEventProps & ProductGridCategoryProps & ProductsCategoryInputProps & SlotBannersProps) {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    error,
    setGtmEventCategory,
    categoryId,
    banners,
    categoryName,
    priceRange,
    pageSize,
    relatedSearches,
  } = props;
  const {t} = useTranslation('product');

  const {document: documentRef} = component.getModels();
  const content = documentRef && page.getContent(documentRef);

  const {discoveryFields = DEFAULT_BRSM_FIELDS} = page!.getChannelParameters();

  const {title, displayName}: any = content?.getData() || page.getDocument<Document>()?.getData() || {
    title: '',
    displayName: '',
  };

  //TODO: Model the parameters
  const params: Record<string, any> = component!.getParameters() || {};
  const {
    template,
    showTitle,
    showAttributeBadge,
    hideSku,
    showSkuSelect = discoveryFields.includes(COLORS_ATTRIBUTE) || discoveryFields.includes(SIZES_ATTRIBUTE),
    showPagination,
    showFacets,
    facetsLocation,
    numberOfColumns = 4,
    caption,
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

  //params.query = category.catId;
  params.categoryDisplayName = title || displayName;

  if (loading) {
    return <Status loading status={'We are fetching category products for you.'} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (!itemsPageResult) {
    return null;
  }

  const displayTitle = caption || t('results-for', {keyword: title || displayName});

  return (
    <ProductGrid
      productGridContent={itemsPageResult}
      priceRange={priceRange}
      banners={banners}
      relatedSearches={relatedSearches}
      productGridParams={{
        template: template || 'default',
        title: displayTitle,
        showAttributeBadge,
        hideSorterControls: !showTitle,
        pageSize,
        enablePriceRange,
        enablePrecisionMode,
        showFacets,
        facetsLocation,
        hideSku,
        showPagination,
        showSkuSelect,
        numberOfColumns: numberOfColumns || 4,
      }} />
  );
}

export const ProductGridByCategory = withGtmEvent(withProductGridCategory(ProductGridByCategoryBase));
