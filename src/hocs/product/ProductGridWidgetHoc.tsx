/* eslint-disable react/display-name */
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

import React, {useContext, useMemo} from 'react';
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/router';
import {BrProps} from '@bloomreach/react-sdk';
import {DEFAULT_UID_COOKIE} from '@/hocs/HocUtils';
import {processUidCookie, UID_COOKIE_NAME} from '@/utils/SearchUtil';
import {useBrSearch} from '@/hooks/useBrSearch';
import {BrProduct, BrWidgetResults} from '@/utils/CommonTypes';
import {PreferenceContext} from '@/contexts/PreferenceContext';

// Component output parameters
export interface ProductGridWidgetProps {
  loading: boolean;
  itemsPageResult?: BrWidgetResults<BrProduct>;
  error?: Error;
  searchParameters?: string;
  endpoint?: string;
}

export interface WidgetParamsInputProps {
  item_ids?: string;
  cat_id?: string;
  query?: string;
  user_id?: string;
  api_type?: string;
  rows?: string;
  filters?: string[];
}

// Component input parameters
export interface ProductGridWidgetInputProps extends WidgetParamsInputProps {
  family: string;
  viewId?: string;
  segment?: string;
  start?: number;
  limit?: number;
  widgetId: string;
}

function withProductGridWidgetBase<P extends BrProps>(
  Component: React.ComponentType<P & ProductGridWidgetProps>,
) {
  return (props: P & ProductGridWidgetInputProps) => {
    const {
      page,
      family,
      viewId,
      segment,
      start = 0,
      limit = 12,
      widgetId,
      item_ids,
      cat_id,
      query,
      user_id,
      filters,
    } = props;

    const {
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryFields,
      discoveryAccountId,
      smAuthKey,
      smDomainKey,
      smAccountId,
      exponeaProjectToken,
    } = page!.getChannelParameters();

    const authKey = discoveryAuthKey || process.env.NEXT_PUBLIC_BRWIDGETS_AUTH_KEY || smAuthKey;
    const domainKey =
      discoveryDomainKey || process.env.NEXT_PUBLIC_BRWIDGETS_DOMAIN_KEY || smDomainKey;
    const accountId =
      discoveryAccountId || process.env.NEXT_PUBLIC_BRWIDGETS_ACCOUNT_ID || smAccountId;

    const endpoint = process.env.NEXT_PUBLIC_BRWIDGETS_ROOT_URI!;

    const defaultFields = discoveryFields || process.env.NEXT_PUBLIC_BRWIDGETS_FIELDS!;
    const extraFields = ['onSale', 'inStock'];
    const fields =
      extraFields.length > 0 ? defaultFields + ',' + extraFields.join(',') : defaultFields;

    const [cookies] = useCookies([UID_COOKIE_NAME]);
    const router = useRouter();
    const uidCookie = cookies[UID_COOKIE_NAME] || DEFAULT_UID_COOKIE;

    const processedUidCookie = processUidCookie(uidCookie, !!exponeaProjectToken);

    const currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath;
    const {previousRoute} = useContext(PreferenceContext);
    const refUrl = process.env.NEXT_PUBLIC_URL + (previousRoute.current || router.asPath);

    const filtersInput = JSON.stringify(filters);

    const params = useMemo(
      () => ({
        _br_uid_2: processedUidCookie,
        account_id: accountId,
        domain_key: domainKey,
        auth_key: authKey,
        request_id: new Date().getTime(),
        rows: limit,
        start: start,
        fields,
        url: currentUrl,
        ref_url: refUrl,
        view_id: viewId || '',
        request_type: '',
        segment,
        item_ids,
        cat_id,
        query,
        user_id,
        filters,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        accountId,
        authKey,
        domainKey,
        viewId,
        limit,
        start,
        fields,
        segment,
        currentUrl,
        refUrl,
        item_ids,
        cat_id,
        query,
        user_id,
        processedUidCookie,
        filtersInput,
      ],
    );

    const pathSegment = family === 'visual_search' ? 'visual/search' : family;

    const [results, loading, error, searchParameters] = useBrSearch(`${endpoint}/${pathSegment}/${widgetId}`, params);

    let itemsPageResult;
    if (!loading && !error && results) {
      itemsPageResult = results as BrWidgetResults<BrProduct>;
    }

    return <Component
      {...{
        loading,
        itemsPageResult,
        error,
        searchParameters,
        endpoint: `${endpoint}/${pathSegment}/${widgetId}`,
      }}
      {...props}
    />;
  };
}

export function withProductGridWidget<P extends BrProps>(
  Component: React.ComponentType<P & ProductGridWidgetProps>,
) {
  return withProductGridWidgetBase(Component);
}
