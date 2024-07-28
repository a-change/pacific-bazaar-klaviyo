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

import React, {createContext, useEffect, useReducer, useRef} from 'react';
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/router';

const DEFAULT_CHANNEL_COOKIE = 'pacific_default_channel';
const ENABLE_HEATMAP_COOKIE = 'pacific_enable_heatmap';

type PreferenceType = {
  channel?: string,
  enableHeatmap?: boolean
}

type PreferenceContextType = {
  preference: PreferenceType,
  setPreference: React.Dispatch<PreferenceType>,
  previousRoute: React.MutableRefObject<string>
}

export type {
  PreferenceContextType,
  PreferenceType,
};

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

function PreferenceProvider(props: any) {
  const [cookies, setCookies, remoteCookie] = useCookies();
  const [preference, setPreference] = useReducer((preference: PreferenceType, newPreference: PreferenceType) => {
    return {...preference, ...newPreference};
  }, {
    channel: cookies?.[DEFAULT_CHANNEL_COOKIE],
    enableHeatmap: cookies?.[ENABLE_HEATMAP_COOKIE],
  });

  const router = useRouter();

  const previousRoute = useRef<string | null>(null);

  router.events?.on('routeChangeStart', () => {
    previousRoute.current = router.asPath;
  });

  useEffect(() => {
    if (preference) {
      if (preference?.channel) {
        setCookies(DEFAULT_CHANNEL_COOKIE, preference?.channel, {
          path: '/',
          maxAge: 3600 * 24 * 7, // just keep for one week
        });
      } else {
        remoteCookie(DEFAULT_CHANNEL_COOKIE);
      }
      if (preference?.enableHeatmap) {
        setCookies(ENABLE_HEATMAP_COOKIE, preference?.enableHeatmap, {
          path: '/',
          maxAge: 3600 * 24 * 7, // just keep for one week
        });
      } else {
        remoteCookie(ENABLE_HEATMAP_COOKIE);
      }
    } else {
      remoteCookie(DEFAULT_CHANNEL_COOKIE);
      remoteCookie(ENABLE_HEATMAP_COOKIE);
    }
  }, [preference]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PreferenceContext.Provider value={
      {
        preference,
        setPreference,
        previousRoute,
      }
    }>
      {props.children}
    </PreferenceContext.Provider>
  );
}

export {PreferenceContext, PreferenceProvider};

