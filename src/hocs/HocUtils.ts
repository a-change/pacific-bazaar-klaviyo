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
import {sessionService} from '@/utils/SessionService';

export function getSmViewId(page: Page): string | undefined {
  const {
    smViewId,
    discoveryViewId,
  } = page.getChannelParameters();
  return sessionService.getPreferredSmViewId() || smViewId || discoveryViewId;
}

export const getDiscoveryEndpoint = (discoveryRealm: string) => {
  return `https://${discoveryRealm === 'STAGING' ? 'staging-' : ''}core.dxpapi.com/api/v1/core/`;
};

export const sortFieldsMapping: Record<string, string> = {
  '-purchasePrice': 'price desc',
  'purchasePrice': 'price asc',
  '-displayName': 'title desc',
  'displayName': 'title asc',
};

export const DEFAULT_STATS_FIELD = 'sale_price'; //'price';

export const UID_COOKIE_NAME = '_br_uid_2';
export const DEFAULT_UID_COOKIE = '7797686432023:v=11.5:ts=1428617911187:hc=55';
export const DEFAULT_BRSM_FIELDS = process.env.NEXT_PUBLIC_BRSM_FIELDS || 'pid,title,brand,price,sale_price,promotions,thumb_image,sku_thumb_images,sku_swatch_images,sku_color_group,url,price_range,sale_price_range,description,is_live,score,skuid,onSale,inStock';

export const ALGORITHM_PARAM_NAME = 'algorithm';
export const ALGORITHM_COOKIE_MAPPING = {
  performanceRanking: 'uid=3887804411002:v=12.0:ts=1559140374393:hc=263',
  semanticSearch: 'uid=3887804411001:v=12.0:ts=1559140374393:hc=263',
  none: 'uid=3887804411000:v=12.0:ts=1559140374393:hc=263',
  full: 'uid=3887804411099:v=12.0:ts=1559140374393:hc=263',
};