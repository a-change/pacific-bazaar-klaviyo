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

import React, {useEffect, useMemo, useState} from 'react';
import {useCookies} from 'react-cookie';
import {BrProps} from '@bloomreach/react-sdk';
import {DEFAULT_UID_COOKIE, getSmViewId, UID_COOKIE_NAME} from '@/hocs/HocUtils';
import {useBrSearch} from '@/hooks/useBrSearch';
import {Suggestions} from '@/components/search-box/SearchBoxComponentTypes';
import {useRouter} from 'next/router';

export interface SuggestionsProps {
  loading: boolean;
  suggestions?: Suggestions;
  error?: Error;
}

export interface SuggestionsInputProps {
  input: string;
  viewId?: string;
}

function withSuggestionsBase<P extends BrProps>(
  Component: React.ComponentType<P & SuggestionsProps>,
) {
  // eslint-disable-next-line react/display-name
  return (props: P & SuggestionsInputProps) => {
    const {page, input, viewId} = props;

    const [cookies] = useCookies([UID_COOKIE_NAME]);
    const [smViewId, setSmViewId] = useState('');

    const router = useRouter();

    useEffect(() => {
      setSmViewId(viewId || getSmViewId(page) || '');
    }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryAccountId,
      smAuthKey,
      smDomainKey,
      smAccountId,
    } = page.getChannelParameters();

    const authKey = discoveryAuthKey || smAuthKey;
    const domainKey = discoveryDomainKey || smDomainKey;
    const accountId = discoveryAccountId || smAccountId;

    const endpoint = process.env.NEXT_PUBLIC_SUGGESTION_ROOT_URI!;
    const uidCookie = cookies[UID_COOKIE_NAME];
    const params = useMemo(
      () => ({
        _br_uid_2: uidCookie || DEFAULT_UID_COOKIE,
        view_id: viewId,
        account_id: accountId,
        auth_key: authKey,
        domain_key: domainKey,
        catalog_views: domainKey,
        request_type: 'suggest',
        url: process.env.NEXT_PUBLIC_URL + router.asPath,
        ref_url: process.env.NEXT_PUBLIC_URL + router.asPath,
        request_id: new Date().getTime(),
        q: input,
      }),
      [
        uidCookie,
        accountId,
        authKey,
        domainKey,
        viewId,
        input,
        router.asPath,
      ],
    );

    // Perform actual search query
    const [results, loading, error] = useBrSearch(endpoint, params);

    let suggestions;
    if (!loading && !error && results) {
      suggestions = results as Suggestions;
    }

    return <Component
      {...{
        loading,
        suggestions,
        error,
      }}
      {...props}
    />;
  };
}

export function withSuggestions<P extends BrProps>(
  Component: React.ComponentType<P & SuggestionsProps>,
) {
  return withSuggestionsBase(Component);
}
