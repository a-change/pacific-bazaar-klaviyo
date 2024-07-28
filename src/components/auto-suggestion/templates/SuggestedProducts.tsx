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
import {useTranslation} from 'next-i18next';
//mui
import {List, ListItem} from '@mui/material';
//components
import {H4} from '@/components/common/bazaar/Typography';
//types
import {BrProduct} from '@/utils/CommonTypes';
//templates
import {ProductSuggested} from '@/components/product/templates/ProductSuggested';

export interface SuggestedProductsProps {
  products: Array<BrProduct> | undefined;
}

export const SuggestedProducts = (props: SuggestedProductsProps) => {
  const {
    products,
  } = props;

  const {t} = useTranslation('facet', {});

  const hasProducts = products && products.length > 0;
  if (!hasProducts) {
    return null;
  }
  return (
    <List>
      <ListItem>
        <H4 sx={{fontWeight: 'bold'}}>{t('products')}</H4>
      </ListItem>
      {products?.map((product, key: number) => {
        return (
          <ListItem key={key}>
            <ProductSuggested productContent={product} productParams={{template: 'suggested'}} />
          </ListItem>
        );
      })}
    </List>
  );
};
