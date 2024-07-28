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

import {BaseGridParams, BaseProductParams, BaseSorterParams, BrProduct, BrSearchResults} from '@/utils/CommonTypes';
import {PriceRange} from '@/hocs/HocTypes';
import {WidgetParams} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentTypes';
import {PrecisionModeType} from '@/components/product/ProductComponentTypes';
import {SlotBanner} from '@/components/pacific-product-grid-by-category/ProductGridByCategory';
import {WidgetProps} from '@/components/gtm/GTMComponentTypes';
import {GtmEventCategory} from '@/hocs/gtm/GtmEventHoc';

type ProductGridTemplate =
  | 'default'
  | 'list'
  | 'carousel'
  | 'marquee'
  | 'image-list'
  | 'image-list-fullscreen'
  | 'frequently-bought-together';

type ProductGridParams = BaseGridParams & BaseProductParams & BaseSorterParams & {
  template: ProductGridTemplate;
  //facets
  enablePriceRange?: boolean;
  enablePrecisionMode?: boolean;
  hideDiscoveryApiViewer?: boolean;
}

type ProductGridTemplateProps = {
  productGridContent: BrSearchResults<BrProduct>,
  productGridParams?: ProductGridParams;
  banners?: Array<SlotBanner>,
  priceRange?: PriceRange;
  widgetParams?: WidgetParams;
  precisionMode?: PrecisionModeType;
  productUrl?: Function;
  relatedSearches?: Array<string>;
  widgetProps?: WidgetProps;
  category?: GtmEventCategory;
}

export type {
  ProductGridTemplate,
  ProductGridParams,
  ProductGridTemplateProps,
};
