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

import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import {BrProps} from '@bloomreach/react-sdk';
import {DEFAULT_BRSM_FIELDS, getDiscoveryEndpoint, getSmViewId} from '@/hocs/HocUtils';
import {BrProduct} from '@/utils/CommonTypes';
import {ItemId} from '@/hocs/HocTypes';
import {useBrSearch} from '@/hooks/useBrSearch';
import {ProductComponentParams} from '@/components/product/ProductComponentTypes';
import {PreferenceContext} from '@/contexts/PreferenceContext';

export interface ProductDetailProps {
  loading: boolean;
  item?: BrProduct;
  error?: Error,
  params: ProductComponentParams;
  productId?: string;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
}

export interface ProductDetailInputProps {
  productIdInput: string;
  params: ProductComponentParams;
}

function withProductDetailBase<P extends BrProps>(Component: React.ComponentType<P & ProductDetailProps>) {
  return (props: P & ProductDetailInputProps) => {
    const page = props.page!;
    const {productIdInput, params: productParams} = props;
    const [productId, setProductId] = useState<string>(productIdInput);

    const [smViewId, setSmViewId] = useState('');
    useEffect(() => {
      setSmViewId(getSmViewId(props.page!) || '');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const router = useRouter();

    const {
      discoveryRealm,
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryAccountId,
      discoveryFields,
      smAuthKey,
      smDomainKey,
      smAccountId,
    } = page!.getChannelParameters();

    const endpoint = getDiscoveryEndpoint(discoveryRealm);
    const authKey = discoveryAuthKey || smAuthKey;
    const domainKey = discoveryDomainKey || smDomainKey;
    const accountId = discoveryAccountId || smAccountId;
    const fields = discoveryFields || DEFAULT_BRSM_FIELDS;

    const currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath;

    const {previousRoute} = useContext(PreferenceContext);
    const refUrl = process.env.NEXT_PUBLIC_URL + (previousRoute.current || router.asPath);

    useEffect(() => {
      setProductId(productIdInput);
    }, [productIdInput]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!productId) {
      return null;
    }

    const itemId: ItemId = new ItemId(productId);

    const pid = itemId.id ?? '';

    const params = useMemo(
      () => {
        return {
          view_id: smViewId,
          account_id: accountId,
          auth_key: authKey,
          domain_key: domainKey,
          search_type: 'keyword',
          request_type: 'search',
          url: currentUrl,
          ref_url: refUrl,
          request_id: new Date().getTime(),
          //widget_id: widgetId || widget?.[searchType],
          //user_id: userId,
          fl: fields.split(','),
          rows: 10,
          q: !pid && itemId.code ? `sku_ids:${itemId.code}` : (pid ?? ''),
          fq: {
            id: 'pid',
            values: [pid],
          },
          facet: 'false',
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        accountId,
        authKey,
        domainKey,
        smViewId,
        itemId.code,
        pid,
        fields,
        currentUrl,
      ],
    );

    // Perform actual search query
    const [results, loading, error] = useBrSearch(endpoint, params);

    let item;
    if (!loading && !error) {
      const {
        response,
      } = results;

      const {docs} = response ?? {};
      item = (docs as (BrProduct)[])?.[0];
    }

    return <Component
      productId={productId}
      params={productParams}
      setProductId={setProductId}
      item={item}
      error={error}
      loading={loading}
      {...props}
    />;
  };
}

export function withProductDetail<P extends BrProps>(Component: React.ComponentType<P & ProductDetailProps>) {
  return withProductDetailBase(Component);
}
