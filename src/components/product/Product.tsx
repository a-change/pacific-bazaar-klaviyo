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
import React, {useEffect} from 'react';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {ProductDetailProps, withProductDetail} from '@/hocs/product/ProductDetailHoc';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {Status} from '@/components/common/status/Status';
import {OutOfStock} from '@/components/common/out-of-stock/OutOfStock';
//templates
import {ProductCard, ProductDetails, ProductImage, ProductSuggested} from '@/components/product/templates';

function ProductBase(props: BrProps & GtmEventProps & ProductDetailProps) {
  const {
    productId,
    params,
    item,
    loading,
    error,
    setGtmEventProduct,
  } = props;

  const {pid, title, variants} = item ?? {};
  const code = variants?.[0]?.skuid ?? pid;

  useEffect(() => {
    if (pid && code) {
      setGtmEventProduct({
        code,
        prodId: pid,
        prodName: title,
      });
    }
  }, [pid, code]); // eslint-disable-line react-hooks/exhaustive-deps


  if (loading) {
    return <Status loading status={'We are fetching product for you.'} />;
  }

  if (error) {
    return <Status error customMessage={error.message} />;
  }

  if (!item) {
    return <OutOfStock productId={productId} />;
  }

  const {template} = params;

  switch (template) {
    case 'suggested':
      return <ProductSuggested productContent={item} productParams={params} />;
    case 'card':
      return <ProductCard productContent={item} productParams={params} />;
    case 'image':
      return <ProductImage productContent={item} productParams={params} />;
    default:
      return <ProductDetails productContent={item} productParams={params} productId={productId} />;
  }
}

export const Product = withWrapper(withGtmEvent(withProductDetail(ProductBase)));
