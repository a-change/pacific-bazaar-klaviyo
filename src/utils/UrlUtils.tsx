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

export const SEGMENT_PARAM_NAME = 'seg';
export const AFFINITY_PARAM_NAME = 'lvl';

export const SEGMENT_SAAS_PARAM_NAME = 'btm_segment';
export const CAMPAIGN_PARAM_NAME = 'btm_campaign_id';

export const isSaas = (): boolean => {
  const brBaseUrl: string = process.env.NEXT_PUBLIC_BRXM_ENDPOINT!;
  return brBaseUrl.indexOf('delivery/site') !== -1;
};

export const updateUrlParameter = (parameterValue: string, parameterName: string, toggle = false) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (toggle) {
    if (searchParams.has(parameterName)) {
      searchParams.delete(parameterName);
    } else {
      searchParams.set(parameterName, parameterValue);
    }
  } else {
    if (parameterValue) {
      searchParams.set(parameterName, parameterValue);
    } else {
      if (searchParams.has(parameterName)) {
        searchParams.delete(parameterName);
      }
    }
  }
  return `${window.location.pathname}?${searchParams}`;
};

export const getUrl = (url: string | null | undefined, page: Page) => {
  return url ? page.getUrl(url) : '';
};

export const lastSegmentOfUrl = (path: string) => {
  // Try to take the last segment as category id
  const pathSegments = path.split('/');
  if (pathSegments.length >= 2) {
    let lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment) {
      if (lastSegment.indexOf('?') !== -1) {
        lastSegment = lastSegment.substring(0, lastSegment.indexOf('?'));
      }
      return lastSegment;
    }
  }
};

export const slugify = (text: string) => {
  return text
    .toString()                   // Cast to string (optional)
    .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, '') // Deletes all the accents
    .toLowerCase()                // Convert the string to lowercase letters
    .trim()                       // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\_/g, '-')           // Replace _ with -
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/\-$/g, '');         // Remove trailing -
};

