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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
//components
import {BannerComponent} from '@/components/banner/BannerComponent';
//types
import {ProductShowcaseComponentCustomProps, ProductShowcaseTemplateProps} from './ProductShowcaseComponentTypes';
import {Grid} from '@mui/material';
import {ProductShowcaseGrid} from '@/components/product-showcase/templates/ProductShowcaseGrid';

function ProductShowcaseBase(props: BrProps & ProductShowcaseComponentCustomProps & ProductShowcaseTemplateProps) {
  const {
    page,
    component,
    productShowcaseContent: {banner, products},
    productShowcaseParams: {template, textAlignment, textColor},
  } = props;

  switch (template) {
    case 'products-right':
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <BannerComponent
              {...{page, component}}
              documentRef={banner}
              params={{
                template: 'product-showcase',
                textAlignment,
                textColor,
              }}
              disableWrapper
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProductShowcaseGrid products={products} {...{page, component}} />
          </Grid>
        </Grid>
      );
    case 'products-left':
    default:
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ProductShowcaseGrid products={products} {...{page, component}} />
          </Grid>
          <Grid item xs={12} md={6}>
            <BannerComponent
              {...{page, component}}
              documentRef={banner}
              params={{
                template: 'product-showcase',
                textAlignment,
                textColor,
              }}
              disableWrapper
            />
          </Grid>
        </Grid>
      );
  }
}

export const ProductShowcase = withWrapper(withInlineEditing(ProductShowcaseBase));
