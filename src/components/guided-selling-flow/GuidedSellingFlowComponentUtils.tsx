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
import {getImageVariantBySize, getImageVariants} from '@/utils/ImageUtils';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {
  GuidedSellingFlowContent,
  GuidedSellingStep,
} from '@/components/guided-selling-flow/GuidedSellingFlowComponentTypes';

export const getGuidedSellingFlowContent = (data: any, page: Page): GuidedSellingFlowContent => {
  const {footer, header, image, steps} = data;
  const images = getImageVariants(image, page);
  const imageUrl = getImageVariantBySize(images, ImageSizeEnum.Large);

  return {
    footer: footer.value,
    header: header.value,
    imageUrl,
    steps: steps.map((ref: any) => {
      const document = ref && page.getContent(ref);
      if (document) {
        const {key, options, text, title} = document.getData();
        const optionsContent = options.map(({icon, label, value}: any) => {
          const images = getImageVariants(icon, page);
          const iconUrl = getImageVariantBySize(images, ImageSizeEnum.Small);
          return {
            iconUrl,
            label,
            value,
          };
        });

        return {
          paramName: key,
          options: optionsContent,
          text,
          title,
        } as GuidedSellingStep;
      }
    }),
  } as GuidedSellingFlowContent;
};

export const getMockGuidedSellingFlowContent = () => {
  return {
    imageUrl: 'https://pacific-saas.bloomreach.io/delivery/resources/content/gallery/pacific-home/banners/menu/edition.jpg',
    steps: [{
      text: 'Mock Step 1',
      title: 'Mock Step 1 Title',
      paramName: 'Para 1',
      options: [{
        label: 'Mock Label 1',
        value: 'Mock Value 1',
        iconUrl: 'https://pacific-saas.bloomreach.io/delivery/resources/content/gallery/pacific-home/banners/menu/edition.jpg',
      }],
    }, {
      text: 'Mock Step 2',
      title: 'Mock Step 2 Title',
      paramName: 'Para 2',
      options: [{
        label: 'Mock Label 2',
        value: 'Mock Value 2',
        iconUrl: 'https://pacific-saas.bloomreach.io/delivery/resources/content/gallery/pacific-home/banners/menu/edition.jpg',
      }],
    }],
  } as GuidedSellingFlowContent;
};
