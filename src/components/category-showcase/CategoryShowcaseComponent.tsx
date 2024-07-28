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
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {Status} from '@/components/common/status/Status';
//types
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {
  CategoryShowcaseComponentCustomProps,
  CategoryShowcaseComponentParams,
  CategoryShowcaseContent,
} from './CategoryShowcaseComponentTypes';
//functions
import {getContentTypePrefix} from '@/utils/DocumentUtils';
//templates
import {CategoryShowcase} from '@/components/category-showcase/CategoryShowcase';

export const CategoryShowcaseComponent = (props: BrProps & CategoryShowcaseComponentCustomProps) => {
  const {page, component, documentRef, params} = props;
  const {t} = useTranslation('common');

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as CategoryShowcaseComponentParams;

  // models
  const {document: categoryShowcase} = component.getModels();
  const categoryShowcaseDocumentRef = documentRef ?? categoryShowcase;

  const document = page.getContent(categoryShowcaseDocumentRef);

  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  let banners = {};

  if (mock) {
    banners['banner1'] = 'mock';
    banners['banner2'] = 'mock';
    banners['banner3'] = 'mock';
    banners['banner4'] = 'mock';
  } else {
    Object.keys(component.getModels()).forEach(key => {
      if (key.startsWith('banner')) {
        banners[key] = (component.getModels())[key];
      }
    });
  }

  const categoryShowcaseContent: CategoryShowcaseContent = {
    heroBanner: mock ? 'mock' : categoryShowcaseDocumentRef,
    banners,
  };

  const categoryShowcaseParams: CategoryShowcaseComponentParams = mergedParams;

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}Banner-document`,
    path: 'banners',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}Banner`,
    editOnly: false,
  };

  return <CategoryShowcase {...{
    ...props,
    ...renderInlineEditingProps,
    categoryShowcaseContent,
    categoryShowcaseParams,
    mock,
  }} />;
};