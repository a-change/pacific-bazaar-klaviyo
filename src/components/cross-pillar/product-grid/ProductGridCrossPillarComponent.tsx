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
import {ContainerItem, getContainerItemContent, Page} from '@bloomreach/spa-sdk';
//components
import {SearchComponent} from '@/components/search/SearchComponent';
//functions
import {slugify} from '@/utils/UrlUtils';
import {useRouter} from 'next/router';
import {ProductCategoryComponent} from '@/components/category/ProductCategoryComponent';

export const productUrl = (page: Page, productId: string, productCode?: string | null, title?: string | null) => {
  const route = '/p/' + slugify(title || 'slug');
  const productPageUrl = `${route}/${productId}___${productCode || ''}`;
  return page.getUrl(productPageUrl);
};

export const ProductGridCrossPillarComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;
  const {asPath} = useRouter();

  // models
  const content = getContainerItemContent<any>(component, page);

  if (!page.isPreview() && !content) {
    return null;
  }

  const {search, pageSize, groupby = {}} = content;
  const {limit, options, rows} = groupby;

  // parameters
  const {layout} = component.getParameters();

  let numberOfColumns = 4;
  if (layout) {
    switch (layout) {
      case '2cols':
        numberOfColumns = 2;
        break;
      case '3cols':
        numberOfColumns = 3;
        break;
      case '4cols':
        numberOfColumns = 4;
        break;
    }
  }

  let query = search?.[0]?.query;

  if (asPath.indexOf('/c/') !== -1) {
    return <ProductCategoryComponent
      params={{
        template: 'default',
        showCaption: true,
        productUrl,
      }}
      {...props}
    />;
  }

  return <SearchComponent
    params={{
      template: 'default',
      query,
      pageSize,
      showCaption: true,
      showContent: false,
      productUrl,
      numberOfColumns,
      groupLimit: limit || 8,
      groupByOptions: options?.map(option => ({
        key: option?.key,
        value: option?.value,
        text: option?.value,
      })),
    }}
    {...props}
  />;

};