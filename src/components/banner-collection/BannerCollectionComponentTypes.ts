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
import {BannerComponentCustomProps} from '@/components/banner/BannerComponentTypes';

type BannerCollectionContent = {
  title?: string;
  subTitle?: string;
  banners: Array<BannerComponentCustomProps>;
};

type BannerCollectionTemplate =
  | 'card'
  | 'cardlarge'
  | 'categorycards'
  | 'fashionservices1'
  | 'fashionservices2'
  | 'giftservices'
  | 'groceryservices'
  | 'marketservices'
  | 'navItem'
  | 'textbelowimage'
  | 'textoverimage'
  | 'threebythree'
  | 'usp'
  | 'text-only-strip'
  | 'image-list'

type BannerCollectionComponentParams = {
  template: BannerCollectionTemplate;
};

type BannerCollectionComponentCustomProps = {
  pageable: Partial<Record<string, Reference>>;
  params?: BannerCollectionComponentParams;
};

type BannerCollectionTemplateProps = {
  bannerCollectionContent: BannerCollectionContent,
  bannerCollectionParams?: BannerCollectionComponentParams
}

export type {
  BannerCollectionContent,
  BannerCollectionTemplateProps,
  BannerCollectionTemplate,
  BannerCollectionComponentParams,
  BannerCollectionComponentCustomProps,
};