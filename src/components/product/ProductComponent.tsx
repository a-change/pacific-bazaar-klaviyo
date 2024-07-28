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

//react
import React from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {Product} from '@/components/product/Product';
import {Status} from '@/components/common/status/Status';
//types
import {ProductComponentCustomProps, ProductComponentParams} from '@/components/product/ProductComponentTypes';
//functions
import {getProductIdFromUrl} from '@/components/product/ProductComponentUtils';
import {ContainerItem, getContainerItemContent} from '@bloomreach/spa-sdk';

export const PARAM_PRODUCT_ID = 'productId';

export const ProductComponent = (props: BrProps<ContainerItem> & ProductComponentCustomProps) => {
  const {page, component, params = {}} = props;

  const {t} = useTranslation(['product', 'common']);

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ProductComponentParams;

  let productIdInput = mergedParams[PARAM_PRODUCT_ID];
  const router = useRouter();

  const content = getContainerItemContent<any>(component, page);

  if (content?.title) {
    mergedParams.title = content?.title;
  }

  if (content?.product?.productid) {
    productIdInput = content?.product?.productid;
  }

  if (!productIdInput) {
    const queryParameters = router.query;
    const pid = queryParameters['pid'];
    const sku = queryParameters['sku'] ?? pid;
    if (pid && sku) {
      productIdInput = `${pid}___${sku}`;
    }
  }

  if (!productIdInput) {
    productIdInput = getProductIdFromUrl(false, router.asPath);
  }

  if (!productIdInput) {
    if (page.isPreview()) {
      return <Status warning status={t('click-here-to-edit-component', {name: 'Product', ns: 'common'})} />;
    } else {
      return <Status container error status={t('product-id-not-provided')} />;
    }
  }

  return <Product {...{
    productIdInput,
    page,
    component,
    params: mergedParams,
  }} />;
};