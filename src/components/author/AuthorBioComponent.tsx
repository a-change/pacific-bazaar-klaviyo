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
import {Document} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//components
import {AuthorBio} from '@/components/author/AuthorBio';
//types
import {AuthorBioComponentCustomProps, AuthorBioComponentParams} from '@/components/author/AuthorBioComponentTypes';
//functions
import {getAuthorBioContent, getAuthorBioParams} from '@/components/author/AuthorBioComponentUtils';
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {getContentTypePrefix} from '@/utils/DocumentUtils';

export const AuthorBioComponent = (props: BrProps & AuthorBioComponentCustomProps) => {
  const {page, component, documentRef: documentRefCustom, params} = props;
  const {document: documentRef} = component!.getModels();

  // models
  const {pagination} = component.getModels();
  const authorBioDocumentRef = documentRefCustom ?? documentRef;

  const document = authorBioDocumentRef ? page.getContent(authorBioDocumentRef) : page.getDocument<Document>();

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as AuthorBioComponentParams;

  if (!page.isPreview() && !document) {
    return null;
  }

  const data = document?.getData();

  const authorBioContent = getAuthorBioContent(data, pagination, page);
  const authorBioParams = getAuthorBioParams(mergedParams);

  const prefix = getContentTypePrefix(page);

  const renderInlineEditingProps: RenderInlineEditingProps = {
    content: document,
    documentTemplateQuery: `new-demo${prefix}author-document`,
    path: 'authors',
    //pickerSelectableNodeTypes: `brxsaas:demo${prefix}Author`,
    editOnly: false,
  };

  return <AuthorBio {...{
    ...props,
    ...renderInlineEditingProps,
    authorBioContent,
    authorBioParams,
  }} />;
};
