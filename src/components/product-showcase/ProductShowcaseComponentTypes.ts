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

import {Reference} from '@bloomreach/spa-sdk';
import {BrProduct} from '@/utils/CommonTypes';

type ProductShowcaseContent = {
  banner: Reference;
  products: Array<BrProduct>;
};

type ProductShowcaseTemplate =
  | 'products-right'
  | 'products-left';

type ProductShowcaseComponentParams = {
  template: ProductShowcaseTemplate;
  textAlignment: string;
  textColor: string;
};

type ProductShowcaseComponentCustomProps = {
  documentRef?: Reference;
  params?: ProductShowcaseComponentParams;
};

type ProductShowcaseTemplateProps = {
  productShowcaseContent: ProductShowcaseContent,
  productShowcaseParams?: ProductShowcaseComponentParams
}

export type {
  ProductShowcaseContent,
  ProductShowcaseTemplateProps,
  ProductShowcaseTemplate,
  ProductShowcaseComponentParams,
  ProductShowcaseComponentCustomProps,
};