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

import {ProductGridTemplate} from '@/components/search/SearchComponentTypes';
import {CategoryNavigatorComponentParams} from '@/components/category-navigator/CategoryNavigatorComponentTypes';

export interface SlotBanner {
  banner?: any;
  slot?: number;
  productId?: string;
  textColor?: string;
  textAlignment?: string;
}

export interface ProductCategoryComponentParamsProps {
  contentTitle?: string;
  contentSubTitle?: string;
  template: ProductGridTemplate;
  banners?: Array<SlotBanner>;
  relatedSearches?: Array<string>;
  currentPage?: number;
  caption?: string;
  message?: string;
  showCaption?: boolean;
  productUrl?: Function;
}

export type ProductCategoryComponentCustomProps = {
  params?: ProductCategoryComponentParamsProps,
};
