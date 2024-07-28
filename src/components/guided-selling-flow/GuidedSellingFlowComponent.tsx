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
//components
import {GuidedSellingFlow} from '@/components/guided-selling-flow/GuidedSellingFlow';
//types
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {
  GuidedSellingFlowComponentCustomProps,
  GuidedSellingFlowComponentParams,
} from '@/components/guided-selling-flow/GuidedSellingFlowComponentTypes';
//functions
import {
  getGuidedSellingFlowContent,
  getMockGuidedSellingFlowContent,
} from '@/components/guided-selling-flow/GuidedSellingFlowComponentUtils';
import {getContentTypePrefix} from '@/utils/DocumentUtils';

export const GuidedSellingFlowComponent = (props: BrProps & GuidedSellingFlowComponentCustomProps) => {
  const {page, component, documentRef, params} = props;

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as GuidedSellingFlowComponentParams;

  // models
  const {document: guidedSellingFlow} = component.getModels();
  const guidedSellingFlowDocumentRef = documentRef ?? guidedSellingFlow;

  const document = page.getContent(guidedSellingFlowDocumentRef);

  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}GuidedSellingFlow-document`,
    path: 'guided-selling',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}GuidedSellingFlow`,
    editOnly: false,
  };

  const data = document?.getData();
  const guidedSellingFlowContent = data ? getGuidedSellingFlowContent(data, page) : getMockGuidedSellingFlowContent();

  return <GuidedSellingFlow {...{
    ...props,
    ...renderInlineEditingProps,
    guidedSellingFlowContent,
    mock,
  }} />;
};
