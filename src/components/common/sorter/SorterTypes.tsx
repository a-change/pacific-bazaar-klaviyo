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

import React from 'react';
import {WidgetParams} from '@/components/pacific-product-grid-by-widget/ProductGridByWidgetComponentTypes';
import {BaseSorterParams} from '@/utils/CommonTypes';

type SorterOption = {
  key: string,
  icon?: string,
  text: string,
  value: string
}

type SorterParams = BaseSorterParams & {
  template: string;
  options: Array<SorterOption>;
  pageSize: number;
  numberOfColumns: number;
  itemsPerRowOptions?: Array<SorterOption>;
  totalItems: number;
  queryType?: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  autoCorrectQuery?: string | null;
  didYouMean?: (string | null)[] | null;
  query?: string;
  widgetParams?: WidgetParams;
  hideFacetList?: boolean;
  showFacetList?: boolean;
  setShowFacetList: React.Dispatch<React.SetStateAction<boolean>>;
  hideDiscoveryApiViewer?: boolean;
}

export type {
  SorterOption,
  SorterParams,
};
