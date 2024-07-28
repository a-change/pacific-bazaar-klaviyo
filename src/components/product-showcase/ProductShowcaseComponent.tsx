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
//types
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {
  ProductShowcaseComponentCustomProps,
  ProductShowcaseComponentParams,
  ProductShowcaseContent,
} from './ProductShowcaseComponentTypes';
import {ProductShowcase} from '@/components/product-showcase/ProductShowcase';
//functions
import {
  getMockProductShowcaseContent,
  getPickedProducts,
} from '@/components/product-showcase/ProductShowcaseComponentUtils';
import {getContentTypePrefix} from '@/utils/DocumentUtils';

export const ProductShowcaseComponent = (props: BrProps & ProductShowcaseComponentCustomProps) => {
  const {page, component, documentRef, params} = props;

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ProductShowcaseComponentParams;

  // models
  const {document: productShowcase} = component.getModels();
  const productShowcaseDocumentRef = documentRef ?? productShowcase;

  const document = page.getContent(productShowcaseDocumentRef);

  // prod mode without document
  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const productShowcaseContent: ProductShowcaseContent = document ? {
    banner: productShowcaseDocumentRef,
    products: getPickedProducts(document.getData()?.productPicker),
  } : getMockProductShowcaseContent();

  const productShowcaseParams: ProductShowcaseComponentParams = mergedParams;

  const prefix = getContentTypePrefix(page);
  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}ProductShowcase-document`,
    path: 'product-showcases',
    //pickerSelectableNodeTypes: 'brxsaas:demoProductShowcase',
    editOnly: false,
  };

  return <ProductShowcase {...{
    ...props,
    ...renderInlineEditingProps,
    productShowcaseContent,
    productShowcaseParams,
    mock,
  }} />;
};