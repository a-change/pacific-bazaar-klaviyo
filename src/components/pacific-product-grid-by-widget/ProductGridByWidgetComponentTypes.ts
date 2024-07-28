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

import {BrProduct} from '@/utils/CommonTypes';
import {WidgetPair} from '@/components/widget/ProductWidgetComponentTypes';

type WidgetParams = {
  widgets?: WidgetPair[],
  widget?: WidgetPair;
  setWidget?: React.Dispatch<React.SetStateAction<WidgetPair>>;
}

type ProductGridByWidgetTemplate =
  | 'default'
  | 'list'
  | 'small';

type ProductGridByWidgetComponentParams = {
  template: ProductGridByWidgetTemplate;
  widgetType: 'item' | 'category' | 'keyword' | 'global' | 'personalized';
  widgetTitle1: string;
  widgetTitle2: string;
  widgetTitle3: string;
  widgetTitle4: string;
  hideSku: boolean;
  numberOfColumns: number;
  pageSize: number;
  showAttributeBadge: boolean;
  badgeAttribute: 'onSale' | 'inStock' | 'isFrozen';
  widgetParameter: string;
};

type ProductGridByWidgetComponentCustomProps = {
  params?: ProductGridByWidgetComponentParams,
};

type ProductGridByWidgetTemplateProps = {
  productContent: BrProduct,
  productGridByWidgetParams?: ProductGridByWidgetComponentParams
}

export type {
  ProductGridByWidgetTemplateProps,
  ProductGridByWidgetTemplate,
  ProductGridByWidgetComponentParams,
  ProductGridByWidgetComponentCustomProps,
  WidgetParams,
};