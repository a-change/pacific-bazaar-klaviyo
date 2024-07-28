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
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {ImageLink, PacificLink} from '@/utils/CommonTypes';

type BannerContent = {
  title: string;
  subtitle?: string;
  titleLink?: PacificLink;
  links: PacificLink[];
  text: string;
  images: Partial<Record<ImageSizeEnum, ImageLink>>;
};

type BannerTemplate =
  | 'card'
  | 'categorycard'
  | 'default'
  | 'fashionservices1'
  | 'fashionservices2'
  | 'full-width'
  | 'giftservices'
  | 'groceryservices'
  | 'marketservices'
  | 'menu'
  | 'parallax'
  | 'product-showcase'
  | 'showcase'
  | 'sidebar'
  | 'slide'
  | 'slot'
  | 'split-panel'
  | 'split-text'
  | 'textbelowimage'
  | 'textoverimage'
  | 'threebythree'
  | 'usp'
  | 'text-only-strip'
  | 'product-carousel'
  | 'image-list'
  | 'ticker-box';

type BannerSize = 'small' | 'medium' | 'normal' | 'large';

type BannerComponentParams = {
  template?: BannerTemplate;
  textColor: string;
  textAlignment: string;
  imageAlignment?: string;
  verticalAlignment?: string;
  size?: BannerSize;
  rows?: number;
  productLink?: PacificLink;
};

type BannerComponentCustomProps = {
  documentRef?: Reference | string;
  params?: BannerComponentParams;
  disableWrapper?: boolean;
};

type BannerTemplateProps = {
  bannerContent: BannerContent;
  bannerParams?: BannerComponentParams;
}

export type {
  BannerContent,
  BannerSize,
  BannerTemplateProps,
  BannerTemplate,
  BannerComponentParams,
  BannerComponentCustomProps,
};