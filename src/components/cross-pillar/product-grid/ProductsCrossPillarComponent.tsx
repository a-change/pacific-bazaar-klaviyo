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
import {productUrl} from '@/components/cross-pillar';

export const ProductsCrossPillarComponent = (props: BrProps<ContainerItem>) => {
  const {page, component} = props;

  // models
  const content = getContainerItemContent<any>(component, page);

  if (!page.isPreview() && !content) {
    return null;
  }

  const {search, pageSize, groupby = {}} = content;

  // parameters
  const componentParams = component.getParameters();

  const {limit, options, rows} = groupby;

  const query = search?.[0]?.query;

  return <SearchComponent
    params={{
      template: 'default',
      query,
      pageSize,
      productUrl,
      caption: 'Products',
      showCaption: true,
      showContent: false,
      allowEmptyQuery: true,
      groupLimit: limit || 8,
      groupByOptions: options?.map(option => ({
        key: option?.key,
        value: option?.value,
      })),
    }}
    {...props}
  />;

};