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
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//types
import {BannerTemplateProps} from './BannerComponentTypes';
//templates
import {
  BannerCard,
  BannerCategoryCard,
  BannerFullWidth,
  BannerImageList,
  BannerJumbotron,
  BannerMenu,
  BannerProductCarousel,
  BannerServiceItem,
  BannerShowcase,
  BannerSidebar,
  BannerSlide,
  BannerSlot,
  BannerSplitPanel,
  BannerTextBelowImage,
  BannerTextOnlyStrip,
  BannerTickerBox,
  BannerUsp,
} from './templates';

function BannerBase(props: BrProps & BannerTemplateProps) {
  const {bannerContent, bannerParams} = props;
  switch (bannerParams.template) {
    case 'card':
      return <BannerCard {...{bannerContent, bannerParams}} />;
    case 'text-only-strip':
      return <BannerTextOnlyStrip {...{bannerContent, bannerParams}} />;
    case 'fashionservices1':
      return <BannerServiceItem {...{bannerContent, bannerParams}} />;
    case 'fashionservices2':
      return <BannerServiceItem {...{bannerContent, bannerParams}} />;
    case 'giftservices':
      return <BannerServiceItem {...{bannerContent, bannerParams}} />;
    case 'groceryservices':
      return <BannerServiceItem {...{bannerContent, bannerParams}} />;
    case 'marketservices':
      return <BannerServiceItem {...{bannerContent, bannerParams}} />;
    case 'full-width':
      return <BannerFullWidth {...{bannerContent, bannerParams}} />;
    case 'menu':
      return <BannerMenu {...{bannerContent, bannerParams}} />;
    case 'product-showcase':
      return <BannerShowcase {...{bannerContent, bannerParams}} />;
    case 'sidebar':
      return <BannerSidebar {...{bannerContent, bannerParams}} />;
    case 'slide':
      return <BannerSlide {...{bannerContent, bannerParams}} />;
    case 'slot':
      return <BannerSlot {...{bannerContent, bannerParams}} />;
    case 'split-panel':
      return <BannerSplitPanel {...{bannerContent, bannerParams}} />;
    case 'textbelowimage':
      return <BannerTextBelowImage {...{bannerContent, bannerParams}} />;
    case 'categorycard':
      return <BannerCategoryCard {...{bannerContent, bannerParams}} />;
    case 'threebythree':
      return <BannerCategoryCard {...{bannerContent, bannerParams}} />;
    case 'usp':
      return <BannerUsp {...{bannerContent, bannerParams}} />;
    case 'product-carousel':
      return <BannerProductCarousel {...{bannerContent, bannerParams}} />;
    case 'image-list':
      return <BannerImageList {...{bannerContent, bannerParams}} />;
    case 'ticker-box':
      return <BannerTickerBox {...{bannerContent, bannerParams}} />;
    default:
      return <BannerJumbotron {...{bannerContent, bannerParams: props.bannerParams}} />;
  }
}

export const Banner = withWrapper(withInlineEditing(BannerBase));