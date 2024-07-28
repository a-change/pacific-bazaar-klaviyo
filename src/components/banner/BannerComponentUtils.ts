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

import {Page} from '@bloomreach/spa-sdk';
import {BannerComponentParams, BannerContent, BannerTemplate} from './BannerComponentTypes';
import {getImageVariants} from '@/utils/ImageUtils';
import {getLinks, getResourceLink} from '@/utils/LinkUtils';
import {getTextColor} from '@/utils/ThemeUtils';
import {Theme} from '@mui/material';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {PacificLink} from '@/utils/CommonTypes';

const getMockBannerContent = () => {
  return {
    'images': {
      original: {
        type: 'external',
        imageSize: ImageSizeEnum.Original,
        url: 'https://pacific-saas.bloomreach.io/delivery/resources/content/gallery/pacific-home/banners/menu/edition.jpg',
      },
    },
    'links': [
      {
        'url': 'https://www.bloomreach.com',
        'label': 'Read More',
        'isExternal': true,
        'openInNewWindow': true,
      },
    ],
    'subtitle': '',
    'title': 'Mock Banner Title',
    'titleLink': {
      'url': 'https://www.bloomreach.com',
      'label': 'Read More',
      'isExternal': true,
      'openInNewWindow': true,
    },
    'text': '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
  } as BannerContent;
};

const getBannerContent = (
  data: any,
  page: Page,
): BannerContent => {
  const {content, images: image, links: linkRefs, resource, title, subTitle} = data;

  const linksArray = getLinks(linkRefs, page);

  let links = linksArray?.filter((linkRef: any) => linkRef.label) || [];
  const titleLink = linksArray?.find(
    (linkRef: any) => !linkRef.label || 0 === linkRef.label.length,
  );
  const resourceLink = getResourceLink(resource);
  if (resourceLink) {
    links.push(resourceLink);
  }

  return {
    title,
    titleLink,
    subtitle: subTitle ? subTitle?.value : '',
    text: content?.value ?? content,
    links,
    images: getImageVariants(image, page),
  };
};

const getBannerParams = (params: any, theme: Theme): BannerComponentParams => {
  const template = params['template'] || 'default';
  const textAlignment = params['textAlignment'] || params['textAlignmentBanner'] || 'left';
  const textColor = getTextColor(theme, params['textColor'] || params['textColorBanner'] || 'black');
  const imageAlignment = params['imageAlignment'] || params['imageAlignmentBanner'] || 'left';
  const verticalAlignment = params['verticalAlignment'] || params['verticalAlignmentBanner'] || 'center';
  const rows = params['rows'] || params['rowsBanner'] || 1;
  const size = params['size'] || params['rowsBanner'] || 'small';

  const productLink = params?.productLink ? params?.productLink as PacificLink : undefined;

  return {
    template: template as BannerTemplate,
    textAlignment,
    textColor,
    imageAlignment,
    verticalAlignment,
    rows,
    size,
    productLink,
  };
};

const getJustifyContent = (textAlignment: string, downMd?: boolean) => {
  if (downMd) {
    return 'center';
  }

  let justifyContent;
  switch (textAlignment) {
    case 'center':
    case 'middle':
      justifyContent = 'center';
      break;
    case 'right':
    case 'bottom':
      justifyContent = 'flex-end';
      break;
    case 'left':
    case 'top':
    default:
      justifyContent = 'flex-start';
      break;
  }
  return justifyContent;
};

export {
  getJustifyContent,
  getMockBannerContent,
  getBannerContent,
  getBannerParams,
};