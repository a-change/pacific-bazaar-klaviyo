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
import {
  SimpleContentComponentCustomProps,
  SimpleContentComponentParams,
  SimpleContentContent,
} from './SimpleContentComponentTypes';
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
//functions
import {
  getMockSimpleContentContent,
  getSimpleContentContent,
  getSimpleContentParams,
} from './SimpleContentComponentUtils';
import {getContentTypePrefix} from '@/utils/DocumentUtils';
//templates
import {SimpleContent} from '@/components/simple-content/SimpleContent';

export const SimpleContentComponent = (props: BrProps & SimpleContentComponentCustomProps) => {
  const {page, component, documentRef, params} = props;

  // models
  const {document: simpleContent} = component.getModels();
  const simpleContentDocumentRef = documentRef ?? simpleContent;

  const document = page.getContent(simpleContentDocumentRef);

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as SimpleContentComponentParams;

  const {content} = mergedParams;

  let mock = false;
  if (!document && !content) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return null;
    }
  }

  const data = document?.getData();

  const simpleContentContent: SimpleContentContent = content ? content : (data ? getSimpleContentContent(data, page) : getMockSimpleContentContent());
  const simpleContentParams: SimpleContentComponentParams = getSimpleContentParams(mergedParams);

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}Content-document`,
    path: 'content',
    pickerInitialPath: 'content',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}Content`,
    editOnly: false,
  };

  return <SimpleContent {...{
    ...props,
    ...renderInlineEditingProps,
    simpleContentContent,
    simpleContentParams,
    mock,
  }} />;
};