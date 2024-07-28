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
  GuidedSellingContent,
  GuidedSellingStep,
} from '@/components/cross-pillar/guided-selling/GuidedSellingComponentTypes';
import {FacetFieldFilterInput} from '@/hocs/HocTypes';

export const getGuidedSellingContent = (data: any, page: Page): GuidedSellingContent => {
  const {completeLabel, limit, search, steps} = data;
  return {
    query: search?.[0]?.query,
    completeLabel,
    steps: steps.map((ref: any) => {
      const {title, description, threshold, item: itemList} = ref;
      return {
        title,
        description: description?.value,
        items: itemList?.map(item => {
          const {title, image: rawImage, description, values} = item;
          const images = getImageVariants(rawImage, page);
          let facets: Array<FacetFieldFilterInput> = [];
          try {
            const valuesJson = JSON.parse(values);
            Object.entries(valuesJson?.values).forEach(([key, value]) => {
              facets.push({
                id: key,
                values: value as string[],
              });
            });
          } catch (e) {
          }
          return {
            title,
            description: description?.value,
            image: getImageVariantBySize(images, ImageSizeEnum.Small),
            facets,
          };
        }),
      } as GuidedSellingStep;
    }),
  } as GuidedSellingContent;
};

export const getMockGuidedSellingContent = (): GuidedSellingContent => {
  return {
    query: '*',
    completeLabel: 'Mock Complete Label',
    steps: [{
      title: 'Mock Step',
      description: 'Lorem ipsum',
      items: [{
        title: 'Mock Step Title',
        description: 'Lorem ipsum',
      }],
    } as GuidedSellingStep],
  } as GuidedSellingContent;
};