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
import React from 'react';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {BannerCollection} from '@/components/banner-collection/BannerCollection';
//types
import {
  BannerCollectionComponentCustomProps,
  BannerCollectionComponentParams,
} from '@/components/banner-collection/BannerCollectionComponentTypes';
//functions
import {
  getBannerCollectionContent,
  getMockBannerCollectionContent,
} from '@/components/banner-collection/BannerCollectionComponentUtils';

export const BannerCollectionComponent = (
  props: BrProps & BannerCollectionComponentCustomProps,
) => {
  const {page, component, pageable, params = {}} = props;

  // models
  const mergedPageable = pageable || component.getModels();
  //sort mergedPageable by key
  const sortedMergedPageable = Object.keys(mergedPageable)
    .sort()
    .reduce((obj: any, key: any) => {
      obj[key] = mergedPageable[key];
      return obj;
    }, {});

  // parameters
  const componentParams = component.getParameters();
  const bannerCollectionParams = {...componentParams, ...params} as BannerCollectionComponentParams;

  // prod mode without document
  let mock = false;
  const noBanners = Object.keys(sortedMergedPageable).filter((key) => !!sortedMergedPageable[key]).length === 0;
  if (noBanners) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const bannerCollectionContent = !mock ? getBannerCollectionContent(
    sortedMergedPageable,
    bannerCollectionParams,
  ) : getMockBannerCollectionContent();
  return <BannerCollection {...{bannerCollectionContent, bannerCollectionParams, mock}} {...props} />;
};
