/*
 * Copyright 2021 Bloomreach (http://www.bloomreach.com)
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

import {useEffect, useState} from 'react';
import axios from 'axios';

export interface Channel {
  name: string;
}

export function useChannels(
  endpoint: string,
): [Channel[] | undefined | any, boolean, Error | undefined] {
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        setError(undefined);
        setLoading(true);
        const response = await axios.get(`${endpoint}`);
        setResults(response.data);
      } catch (error: any) {
        setResults(undefined);
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint]);

  return [results, loading, error];
}
