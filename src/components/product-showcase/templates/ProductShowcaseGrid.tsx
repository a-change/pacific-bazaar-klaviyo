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
//mui
import {Grid} from '@mui/material';
//components
import {BrProduct} from '@/utils/CommonTypes';
import {ProductComponent} from '@/components/product/ProductComponent';
import {BrProps} from '@bloomreach/react-sdk';

export interface ProductShowcaseGridPros {
  products: Array<BrProduct>;
}

export const ProductShowcaseGrid = (props: BrProps & ProductShowcaseGridPros) => {
  const {page, component, products} = props;

  {/*<ProductCard productParams={{
            template: 'card',
          }} productContent={product} />*/
  }
  return (
    <Grid container spacing={2}>
      {products?.map((product: any, key: number) => (
        <Grid item xs={6} key={key}>
          {/*@ts-ignore*/}
          {product?.pid && <ProductComponent page={page} component={component} params={{
            template: 'card',
            productId: product?.pid,
            hideSku: true,
          }} />}
        </Grid>
      ))}
    </Grid>
  );
};

