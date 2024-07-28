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

import {ENDPOINT_PARAMETER, PAGES_SEGMENT} from '@/utils/CommonUtils';

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