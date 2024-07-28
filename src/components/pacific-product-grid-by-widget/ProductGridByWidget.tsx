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
import React, {useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
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
import {ProductGrid} from '@/components/common/product-grid/ProductGrid';
//types
import {DEFAULT_BRSM_FIELDS} from '@/hocs/HocUtils';
import {COLORS_ATTRIBUTE, SIZES_ATTRIBUTE} from '@/components/product/ProductComponentUtils';
import {
  ProductGridByWidgetComponentCustomProps,
  WidgetParams,
} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentTypes';
//functions
import {getProductGridWidgetProps} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentUtils';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
import {pushGtmEventWidget} from '@/components/gtm/GTMComponentUtils';
import {WidgetPair} from '@/components/widget/ProductWidgetComponentTypes';

export interface ComponentParameters {
  template: string;
  widgets: Array<WidgetPair>;
  widget?: WidgetPair;
  setWidget?: React.Dispatch<React.SetStateAction<WidgetPair>>;
}

export interface AttributeBadgeProps {
  showAttributeBadge?: boolean;
  badgeAttribute?: string;
}

const ProductGridByWidgetBase = (props: BrProps & GtmEventProps & ProductGridWidgetProps & ProductGridWidgetInputProps & ComponentParameters & AttributeBadgeProps & ProductGridByWidgetComponentCustomProps,
) => {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    error,
    template,
    showAttributeBadge,
    badgeAttribute,
    widgets,
    widget,
    setWidget,
  } = props;

  const {t} = useTranslation('product');

  useEffect(() => {
    if (itemsPageResult) {
      const {metadata} = itemsPageResult;
      const widgetProps = metadata?.widget;
      pushGtmEventWidget(widgetProps);
    }
  }, [itemsPageResult]);

  const {discoveryFields} = page!.getChannelParameters();
  const fields = discoveryFields || DEFAULT_BRSM_FIELDS;
  const showSkuSelect = fields.includes(COLORS_ATTRIBUTE) || fields.includes(SIZES_ATTRIBUTE);

  if (loading) {
    return <Status container loading status={t('loading-search-results')} />;
  }

  if (error) {
    return <Status container error customMessage={error.message} />;
  }

  if (!itemsPageResult) {
    return null;
  }

  const productGridProps = getProductGridWidgetProps(itemsPageResult, widget, {
    page,
    component,
  });

  if (!itemsPageResult.response.numFound) {
    const similarProductWidget = widgets?.find(widgetPair => (widgetPair as any)?.title === 'Similar Products');

    if (similarProductWidget && similarProductWidget?.widgetId !== widget?.widgetId) {
      setWidget(similarProductWidget);
    }

    if (!page?.isPreview() && widgets.length === 1) {
      return null;
    } else {
      return (
        page?.isPreview() && <Status container error status={'Products cannot be returned in Preview Mode.'} />
      );
    }
  }

  const widgetParams: WidgetParams = {widgets, widget, setWidget};

  productGridProps.productGridParams.hideSorterControls = false;

  return (
    <ProductGrid
      {...{
        ...productGridProps,
        showAttributeBadge,
        badgeAttribute,
        showSkuSelect,
        template,
        widgetParams,
      }}
    />
  );
};

export const ProductGridByWidget = withGtmEvent(withProductGridWidget(ProductGridByWidgetBase));