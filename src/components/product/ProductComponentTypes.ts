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
import {WidgetProps} from '@/components/gtm/GTMComponentTypes';

type PrecisionModeType = 'standard' | 'high';

type ProductTemplate =
  | 'default'
  | 'card'
  | 'suggested'
  | 'image';

type ProductComponentParams = BaseProductParams & {
  template: ProductTemplate;
  productId?: string;
  widgetProps?: WidgetProps;
  hoverEffect?: boolean;
  size?: 'small' | 'medium' | 'large';
  rows?: number;
  cols?: number;
  title?: string;
};

type ProductComponentCustomProps = {
  params?: ProductComponentParams,
};

type ProductTemplateProps = {
  productContent: BrProduct,
  productParams?: ProductComponentParams
}

export type {
  ProductTemplateProps,
  ProductTemplate,
  ProductComponentParams,
  ProductComponentCustomProps,

  PrecisionModeType,
};