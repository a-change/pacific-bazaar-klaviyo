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

import {Page, Reference} from '@bloomreach/spa-sdk';
import {CollectionItem, ContentItem} from './CommonTypes';

export const ENDPOINT_PARAMETER = 'endpoint';
export const PAGES_SEGMENT = 'pages';

export const brxmEndpointFromUrl = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(ENDPOINT_PARAMETER);
  } else {
    return null;
  }
};

export const channelIdFromPreview = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const endpoint = urlParams.get(ENDPOINT_PARAMETER);

    if (endpoint) {
      const segments = endpoint.split('/');
      return segments[segments.length - 2];
    }
  } else {
    return null;
  }
};

export const defaultBrxmEndpoint = () => {
  return brxmEndpointFromUrl() ?? process.env.NEXT_PUBLIC_BRXM_ENDPOINT!;
};

export const channelsUrl = () => {
  const segments = defaultBrxmEndpoint().split('/');
  if (segments[segments.length - 1] === PAGES_SEGMENT) {
    segments.splice(segments.length - 2, 2);
  }
  return segments.join('/');
};

export const brxmEndpoint = (channelId ?: string | null) => {
  const endpoint = brxmEndpointFromUrl();

  if (endpoint) {
    return endpoint;
  } else {
    let endpointUrl = defaultBrxmEndpoint();
    if (channelId) {
      const index = endpointUrl.indexOf('?');
      let paramsStr = '';
      if (index !== -1) {
        paramsStr = endpointUrl.substring(index);
        endpointUrl = endpointUrl.substring(0, index);
      }
      const segments = endpointUrl.split('/');
      if (segments[segments.length - 1] === PAGES_SEGMENT) {
        segments[segments.length - 2] = channelId;
      } else {
        segments.push(channelId, PAGES_SEGMENT);
      }
      return segments.join('/') + paramsStr;
    } else {
      return endpointUrl;
    }
  }
};

export const getCollectionItems = (page: Page, models: any, params: any, paramsFilters: string[]): CollectionItem[] | undefined => {
  if (!page || !models) return;

  return Object.keys(models)
    .sort()
    .filter((key) => !!models[key])
    .map((key) => {
      const content = getContentItem(page, models[key]);
      const itemParams = getComponentParamsForItem(key, params, paramsFilters);

      return content && {
        content,
        params: itemParams,
      };
    });
};

export const getComponentParamsForItem = (itemKey: string, params: Record<string, any>, filters: string[]): Record<string, any> | undefined => {
  if (!(itemKey && params && filters)) return;

  let filteredParams = {};
  filters.forEach((prefix) => {
    const titleCaseKey = `${itemKey.charAt(0).toUpperCase}${itemKey.substring(1).toLowerCase()}`;
    const checkKey = prefix.replace('#', titleCaseKey);
    const itemParamsKey = prefix.replace('#', '');

    if (params[checkKey]) {
      filteredParams[itemParamsKey] = params[checkKey];
    }
  });

  return filteredParams;
};

export const getContentItem = (page: Page, ref: string | Reference): ContentItem | undefined => {
  if (!(page && ref)) return;

  const document: any = page.getContent(ref);
  if (!document || document.type !== 'document') return;

  const data = document.getData();
  const {id, name, displayName: label, contentType: type, localeString: locale} = data;
  const fields = {};

  const contentitem = {
    id,
    name,
    label,
    type,
    locale,
    fields,
  };

  Object.entries(data).forEach(([key, value]) => {
    if (!Object.keys(contentitem).includes(key)) {
      fields[key] = value;
    }
  });

  return contentitem;
};