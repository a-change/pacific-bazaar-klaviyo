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
import React, {Fragment} from 'react';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {Status} from '@/components/common/status/Status';
import {CommonTitle} from '@/components/common/title/CommonTitle';
//types
import {BannerCollectionTemplateProps} from '@/components/banner-collection/BannerCollectionComponentTypes';
//templates
import {
  BannerCollectionCard,
  BannerCollectionCategoryCards,
  BannerCollectionImageList,
  BannerCollectionServices,
  BannerCollectionTextBelowImage,
  BannerCollectionTextOnlyStrip,
  BannerCollectionTextOverImage,
  BannerCollectionUsp,
} from '@/components/banner-collection/templates';
import {de} from 'date-fns/locale';

function BannerCollectionBase(props: BrProps & BannerCollectionTemplateProps) {
  const {bannerCollectionParams: {template}, bannerCollectionContent, page} = props;

  const {title, subTitle} = bannerCollectionContent;

  const renderBannerCollections = () => {
    switch (template) {
      case 'textbelowimage':
        return <BannerCollectionTextBelowImage {...props} />;
      case 'categorycards':
      case 'threebythree':
        return <BannerCollectionCategoryCards {...props} />;
      case 'fashionservices1':
      case 'fashionservices2':
      case 'giftservices':
      case 'groceryservices':
      case 'marketservices':
        return <BannerCollectionServices {...props} />;
      case 'usp':
        return <BannerCollectionUsp {...props} />;
      case 'text-only-strip':
        return <BannerCollectionTextOnlyStrip {...props} />;
      case 'image-list':
        return <BannerCollectionImageList {...props} />;
      case 'textoverimage':
        return <BannerCollectionTextOverImage {...props} />;
      case 'card':
      default:
        return <BannerCollectionCard {...props} />;
    }
  };

  return (
    <Fragment>
      {title && <CommonTitle title={title} subTitle={subTitle} />}
      {renderBannerCollections()}
    </Fragment>
  );

}

export const BannerCollection = withWrapper(BannerCollectionBase);
