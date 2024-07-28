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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {
  ProductGridWidgetInputProps,
  ProductGridWidgetProps,
  withProductGridWidget,
} from '@/hocs/product/ProductGridWidgetHoc';
//components
import {Status} from '@/components/common/status/Status';
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';//types
//functions
import {pushGtmEventWidget} from '@/components/gtm/GTMComponentUtils';
import {getProductGridWidgetProps} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentUtils';

function ProductRecommendationsBase(props: BrProps & ProductGridWidgetProps & ProductGridWidgetInputProps) {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    error,
    widgetId,
    start,
    limit,
  } = props;

  useEffect(() => {
    if (itemsPageResult) {
      const {metadata} = itemsPageResult;
      const widgetProps = metadata?.widget;
      pushGtmEventWidget(widgetProps);
    }
  }, [itemsPageResult]);

  if (loading) {
    return <Status container loading status={'Loading product recommendations...'} />;
  }

  if (error) {
    return <Status container error customMessage={error.message} />;
  }

  if (!itemsPageResult) {
    return null;
  }

  const productGridProps = getProductGridWidgetProps(itemsPageResult, {
    widgetId,
    title: '',
    subTitle: '',
  }, {page, component});

  //productGridProps.productGridParams.itemsPerRow = limit;
  productGridProps.productGridParams.hideSorterControls = true;

  return (
    <ProductGrid {...{...productGridProps}} />
  );
}

export const ProductRecommendations = withProductGridWidget(ProductRecommendationsBase);
