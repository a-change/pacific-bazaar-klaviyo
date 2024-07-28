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

import {BannerTemplate} from '@/components/banner/BannerComponentTypes';
import {BannerCollectionContent} from '@/components/banner-collection/BannerCollectionComponentTypes';

export const getBannerCollectionContent = (pageable: any, params: any): BannerCollectionContent => {
  const {title, subtitle} = params;
  return {
    title,
    subTitle: subtitle,
    banners: Object.keys(pageable)
      .filter((key) => !!pageable[key])
      .map((key) => {
        const idx = key.replace('banner', 'Banner');
        const itemParams = {
          textAlignment: params[`textAlignment${idx}`] || 'left',
          textColor: params[`textColor${idx}`] || 'black',
          imageAlignment: params[`imageAlignment${idx}`],
          verticalAlignment: params[`verticalAlignment${idx}`] || 'middle',
          template: params.template as BannerTemplate,
        };
        return {
          documentRef: pageable[key],
          params: itemParams,
        };
      }),
  };
};

export const getMockBannerCollectionContent = (): BannerCollectionContent => {
  return {
    title: 'Mock Banner Collection Title',
    subTitle: 'Maecenas fermentum consequat ante. Pellentesque quam purus',
    banners: [{
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }, {
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }, {
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }, {
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }, {
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }, {
      documentRef: 'mock',
      params: {
        textAlignment: 'left',
        textColor: 'black',
        imageAlignment: 'default',
        verticalAlignment: 'middle',
        template: 'default',
      },
    }],
  };
};

