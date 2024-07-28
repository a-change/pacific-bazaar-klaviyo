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

import {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {BrSearchResult, BrSearchResults} from '@/utils/CommonTypes';
import {ALGORITHM_PARAM_NAME, UID_COOKIE_NAME} from '@/hocs/HocUtils';

/* eslint-disable camelcase */
interface BrSearchParams {
  account_id: string;
  domain_key?: string;
  fl?: string[];
  fq?: any; //string | string[]
  'facet.field'?: any;
  q?: string;
  request_type: 'search' | string;
  rows?: number;
  search_type?: 'keyword' | 'category' | string;
  sort?: string;
  start?: number;
  url: string;
  view_id?: string;
  widget_id?: string;
  catalog_name?: string;
  'query.numeric_precision'?: 'standard' | 'high' | string;
  _br_uid_2?: string;
  filters?: string[];
}

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
});

export function useBrSearch<T extends BrSearchResult = BrSearchResult>(
  endpoint: string,
  params: BrSearchParams,
): [BrSearchResults<T> | undefined | any, boolean, Error | undefined, string | undefined] {
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(undefined);

  const query = useMemo(() => {
    const {fl, fq, 'facet.field': facetFields, filters, ...rest} = params;
    const urlParams = [...Object.entries(rest)];
    if (fl) {
      urlParams.push(['fl', Array.isArray(fl) ? fl.join(',') : fl]);
    }

    if (facetFields) {
      urlParams.push(...(Array.isArray(facetFields) ? fq : facetFields.split(','))
        .map((value: any) => ['facet.field', value]),
      );
    }

    if (fq) {
      urlParams.push(...(Array.isArray(fq) ? fq : [fq]).map((value) => {
        const joinedValue = value.values.map((value: any) => `"${value}"`).join(' OR ');
        return ['fq', `${value?.id}:${joinedValue}`];
      }) as [string, any][]);
    }

    if (filters) {
      urlParams.push(...filters.map((value) => {
        return ['filter', `${value}`];
      }) as [string, any][]);
    }
    return new URLSearchParams(urlParams.filter((value) => !!value[1] || value[0] === 'q' || value[0] === UID_COOKIE_NAME || value[0] === ALGORITHM_PARAM_NAME) as any).toString();
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        setError(undefined);
        setLoading(true);
        const response = await axios.get(`${endpoint}?${query}`);
        setResults(response.data);
      } catch (error: any) {
        setResults(undefined);
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, query]);

  return [results, loading, error, query];
}
