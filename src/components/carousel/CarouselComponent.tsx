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
import {Status} from '@/components/common/status/Status';
//types
import {CarouselComponentCustomProps, CarouselComponentParams} from '@/components/carousel/CarouselComponentTypes';
//functions
import {getCarouselContent, getMockCarouselContent} from '@/components/carousel/CarouselComponentUtils';
//templates
import {BannerCarousel} from '@/components/carousel/templates/BannerCarousel';
import {useTranslation} from 'next-i18next';

export const CarouselComponent = (props: BrProps & CarouselComponentCustomProps) => {
  const {page, component, pageable, params = {}} = props;
  const {t} = useTranslation('common');

  // models
  const mergedPageable = pageable || component.getModels();

  // parameters
  const componentParams = component.getParameters();
  const carouselParams = {...componentParams, ...params} as CarouselComponentParams;

  let carouselContent = getCarouselContent(mergedPageable, carouselParams);

  // prod mode without document
  let mock = false;
  const noBanners = carouselContent?.banners?.length === 0;
  if (noBanners) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  if (mock) {
    carouselContent = getMockCarouselContent();
  }

  switch (carouselParams.template) {
    case 'default':
    case 'hero':
    default:
      return <BannerCarousel {...{page, component, carouselContent, carouselParams, mock}} />;
  }
};
