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
//next
import {useRouter} from 'next/router';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {ProductRecommendations} from '@/components/pacific-product-recommendations/ProductRecommendations';
//functions
import {getProductIdFromUrl} from '@/components/product/ProductComponentUtils';

export const ProductRecommendationsComponent = (props: BrProps) => {
  const {component} = props;
  const {widgetId, productFromUrl, cols = 6, rows = 1, pids} = component.getParameters();
  const router = useRouter();
  const productID = getProductIdFromUrl(true, router.asPath);

  const queryParameters = router.query;
  const qsPid = queryParameters['pid'] ?? '';
  const itemIds = productFromUrl ? qsPid || productID : pids;
  const start = 0;
  const limit = cols * rows;

  return (
    <ProductRecommendations
      family={'item'}
      widgetId={widgetId}
      item_ids={itemIds}
      start={start}
      limit={limit}
      {...props}
    />
  );
};
