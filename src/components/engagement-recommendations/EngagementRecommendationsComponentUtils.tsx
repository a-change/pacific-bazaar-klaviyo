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

import {EngagementRecommendationTemplateProps} from './EngagementRecommendations';
import {ProductGridTemplateProps} from '@/components/common/product-grid/ProductGridTypes';
import {LocationEnum} from '@/utils/CommonEnums';

export const getEngagementRecommendationsProps = (
  result: Array<any> | undefined | null,
  params: EngagementRecommendationTemplateProps,
): ProductGridTemplateProps => {
  const {numberOfColumns, caption, subTitle, titleNode, size} = params;

  return {
    productGridContent: {
      facet_counts: {},
      response: {
        docs: result?.map((item: any) => ({
          pid: item?.item_id,
          title: item?.title,
          thumb_image: item?.image,
          sale_price: item?.price,
          price: item?.price,
          variants: [{
            skuid: item?.item_id,
          }],
          price_range: null,
          sale_price_range: null,
          description: '',
        })),
        numFound: result?.length,
        start: 0,
      },
    },
    productGridParams: {
      title: caption ?? '',
      subTitle: subTitle ?? '',
      template: 'default',
      facetsLocation: LocationEnum.Left,
      showPagination: false,
      showFacets: false,
      numberOfColumns: numberOfColumns || 4,
      titleNode,
      hideSorterControls: true,
      hideDiscoveryApiViewer: true,
      pageSize: size,
    },
  };
};

