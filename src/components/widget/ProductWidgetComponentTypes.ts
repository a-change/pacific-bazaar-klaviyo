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

import {BaseProductParams, BrProduct} from '@/utils/CommonTypes';
import React from 'react';

type WidgetType = 'item' | 'category' | 'keyword' | 'global' | 'personalized' | 'visual_search';

type WidgetPair = {
  title: string;
  subTitle: string;
  widgetId: string;
  widgetType?: WidgetType,
  widgetAlgorithm?: string,
  additionalWidgetAlgorithm?: string,
  parameters?: string,
  filters?: string;
}

type WidgetParams = {
  widgets?: WidgetPair[],
  widget?: WidgetPair;
  setWidget?: React.Dispatch<React.SetStateAction<WidgetPair>>;
}

type ProductWidgetTemplate =
  | 'default'
  | 'list'
  | 'small';

type ProductWidgetComponentParams = BaseProductParams & {
  template: ProductWidgetTemplate;
  contentTitle?: string;
  contentSubTitle?: string;
  showCaption: boolean;
  numberOfColumns: number;
  pageSize: number;
  badgeAttribute: 'onSale' | 'inStock' | 'isFrozen';
  hideComponentForEmptyResultSet?: boolean;
};

type ProductWidgetComponentCustomProps = {
  params?: ProductWidgetComponentParams,
};

type ProductWidgetTemplateProps = {
  productContent: BrProduct,
  productWidgetParams?: ProductWidgetComponentParams
}

export type {
  ProductWidgetTemplateProps,
  ProductWidgetTemplate,
  ProductWidgetComponentParams,
  ProductWidgetComponentCustomProps,
  WidgetPair,
  WidgetParams,
  WidgetType,
};