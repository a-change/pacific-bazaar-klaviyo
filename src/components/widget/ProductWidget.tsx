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
import {SlotBanner} from '@/components/category/ProductCategoryComponentTypes';
import {ProductGridTemplate} from '@/components/common/product-grid/ProductGridTypes';
//functions
import {getProductGridWidgetProps} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentUtils';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
import {pushGtmEventWidget} from '@/components/gtm/GTMComponentUtils';
import {
  ProductWidgetComponentCustomProps,
  WidgetPair,
  WidgetParams,
} from '@/components/widget/ProductWidgetComponentTypes';
import {de} from 'date-fns/locale';

export interface ProductWidgetComponentParameters {
  template: string;
  banners?: Array<SlotBanner>;
  showCaption: boolean;
  widgets: Array<WidgetPair>;
  widget?: WidgetPair;
  setWidget?: React.Dispatch<React.SetStateAction<WidgetPair>>;
  showAttributeBadge?: boolean;
  badgeAttribute?: string;
  productUrl?: Function;
  hideComponentForEmptyResultSet?: boolean;
  contentTitle?: string;
  contentSubTitle?: string;
}

const ProductWidgetBase = (props: BrProps & GtmEventProps & ProductGridWidgetProps & ProductGridWidgetInputProps & ProductWidgetComponentParameters & ProductWidgetComponentCustomProps,
) => {
  const {
    page,
    component,
    loading,
    itemsPageResult,
    error,
    template,
    showCaption,
    showAttributeBadge,
    badgeAttribute,
    widgets,
    widget,
    setWidget,
    endpoint,
    searchParameters,
    productUrl,
    banners,
    hideComponentForEmptyResultSet,
    contentTitle,
    contentSubTitle,
  } = props;

  const {t} = useTranslation('product');
  const {discoveryApiCallsState: {setDiscoveryApiCalls}} = useContext(UserContext);

  const params: Record<string, any> = component!.getParameters() || {};
  const componentId = component.getId();

  const {
    showPagination,
  } = params;

  useEffect(() => {
    if (itemsPageResult) {
      const {metadata} = itemsPageResult;
      const widgetProps = metadata?.widget;
      pushGtmEventWidget(widgetProps);
    }
  }, [itemsPageResult]);

  useEffect(() => {
    if (!loading && !error) {
      setDiscoveryApiCalls({
        componentId,
        apiType: 'widget',
        apiCall: {
          endpoint,
          params: new URLSearchParams(searchParameters),
          response: itemsPageResult,
        },
      });
    }
  }, [componentId, loading, error, searchParameters, itemsPageResult, endpoint]);// eslint-disable-line react-hooks/exhaustive-deps

  const {discoveryFields} = page!.getChannelParameters();
  const fields = discoveryFields || DEFAULT_BRSM_FIELDS;
  const showSkuSelect = fields.includes(COLORS_ATTRIBUTE) || fields.includes(SIZES_ATTRIBUTE);

  if (loading) {
    return <Status container loading status={t('loading-search-results')} />;
  }

  if (error) {
    console.error(error);
    return null;
    //return <Status container error status={error.message} />;
  }

  if ((!itemsPageResult || itemsPageResult?.response?.numFound === 0) && hideComponentForEmptyResultSet && !page.isPreview()) {
    return null;
  }

  const productGridProps = getProductGridWidgetProps(itemsPageResult, widget, {
    page,
    component,
  });

  if (!itemsPageResult.response.numFound) {
    if (page.isPreview()) {
      return <Status container error status={t('no-products-found')} />;
    } else {
      if (widgets.length === 1) {
        return null;
      }
    }
  }

  const widgetParams: WidgetParams = {widgets, widget, setWidget};
  productGridProps.productGridParams = {
    ...productGridProps.productGridParams,
    ...{
      hideSorterControls: !showCaption,
      subTitle: contentSubTitle || productGridProps.productGridParams.subTitle,
      title: contentTitle || productGridProps.productGridParams.title,
      template: template as ProductGridTemplate,
      showPagination,
      showAttributeBadge,
    },
  };

  return (
    <ProductGrid
      {...{
        ...productGridProps,
        showAttributeBadge,
        badgeAttribute,
        showSkuSelect,
        widgetParams,
        productUrl,
        widgetProps: itemsPageResult?.metadata?.widget,
        banners,
      }}

    />
  );
};

export const ProductWidget = withGtmEvent(withProductGridWidget(ProductWidgetBase));