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

import {Configuration} from '@bloomreach/spa-sdk';
import {ParsedUrlQuery} from 'querystring';

type BuildConfigurationOptions = {
  endpoint: string | (string | null)[];
  baseUrl: string;
};

type ConfigurationBuilder = Omit<Configuration & Partial<BuildConfigurationOptions>, 'httpClient'>;

export function buildConfiguration(path: string, query: ParsedUrlQuery): ConfigurationBuilder {
  const endpointQueryParameter = 'endpoint';
  const endpoint = query ? query[endpointQueryParameter] as string : null;
  const configuration: ConfigurationBuilder = {};

  if (endpoint) {
    // Preview
    configuration.endpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';

    const segments = endpoint.split('/');
    const channelId = segments[segments.length - 2];

    configuration.baseUrl = `/${channelId}`;
    if (!path.startsWith(`/${channelId}`)) {
      configuration.path = `/${channelId}${path}`;
    } else {
      configuration.path = path;
    }
  } else {
    let baseUrl = '';
    if (query?.channelId) {
      baseUrl = query?.channelId as string;
    }
    configuration.baseUrl = `/${baseUrl}`;

    configuration.path = path;

    let endpointUrl = process.env.NEXT_PUBLIC_BRXM_ENDPOINT ?? '';
    if (baseUrl) {
      const segments = endpointUrl.split('/');
      if (segments[segments.length - 1] === 'pages') {
        segments[segments.length - 2] = baseUrl;
      } else {
        segments.push(baseUrl, 'pages');
      }
      endpointUrl = segments.join('/');
    }
    configuration.endpoint = endpointUrl.endsWith('/') ? endpointUrl : endpointUrl + '/';
  }
  // console.log('[LOAD]', 'Configuration', configuration);

  return configuration;
}
