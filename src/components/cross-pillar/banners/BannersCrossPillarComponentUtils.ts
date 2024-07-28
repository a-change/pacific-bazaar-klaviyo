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

import {Document, Page} from '@bloomreach/spa-sdk';
import {BannerContent} from '@/components/banner/BannerComponentTypes';
import {getImageVariants} from '@/utils/ImageUtils';
import {PacificLink} from '@/utils/CommonTypes';
import {getSelectValue} from '@/utils/SelectUtils';

export const getBannerContent = (banner, page: Page): BannerContent => {
  const {title, subtitle, image: {option}, cta: {link: links = [], type, text}, texttheme: textTheme} = banner;
  const linkType = getSelectValue(type) ?? 'button';
  const textColor = getSelectValue(textTheme) ?? 'black';

  return {
    title,
    subtitle,
    images: getImageVariants(option?.[0], page),
    links: links?.map(linkItem => {
      const {contentType, link, target} = linkItem;
      const openInNewWindow = target === '_blank';
      switch (contentType) {
        case 'brxsaas:bruialphaInternalLink':
          return {
            label: text,
            isExternal: false,
            url: page.getContent<Document>(link)?.getUrl(),
            openInNewWindow,
          } as PacificLink;
        default:
          return {
            label: text,
            isExternal: true,
            url: link,
            openInNewWindow,
          } as PacificLink;
      }
    }),
  } as BannerContent;
};