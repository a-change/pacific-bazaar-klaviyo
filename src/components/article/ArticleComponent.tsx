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
import {Article} from './Article';
import {Status} from '@/components/common/status/Status';
//types
import {RenderInlineEditingProps} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import {ArticleComponentCustomProps, ArticleComponentParams, ArticleContent} from './ArticleComponentTypes';
//functions
import {getArticleContent, getArticleParams, getMockArticleContent} from './ArticleComponentUtils';
import {getContentTypePrefix, getDocument} from '@/utils/DocumentUtils';

export const ArticleComponent = (props: BrProps & ArticleComponentCustomProps) => {
  const {page, component, documentRef, params} = props;
  const {t} = useTranslation('common');

  const {article} = component!.getParameters();
  const prefix = getContentTypePrefix(page);
  const document = getDocument(page, `brxsaas:demo${prefix}Article`, documentRef ?? article);

  // parameters
  const componentParams = component.getParameters();
  const mergedParams = {...componentParams, ...params} as ArticleComponentParams;

  let mock = false;
  if (!document) {
    if (page.isPreview()) {
      mock = true;
    } else {
      return <Status container error status={t('article-not-found')} />;
    }
  }

  const data = document?.getData();

  const articleContent: ArticleContent = data ? getArticleContent(data, page) : getMockArticleContent();
  const articleParams: ArticleComponentParams = getArticleParams(mergedParams);

  if (data) {
    articleContent.link.url = document.getUrl();
  }

  const renderInlineEditingProps: RenderInlineEditingProps = {
    parameter: 'article',
    content: document,
    documentTemplateQuery: `new-demo${prefix}Article-document`,
    path: 'articles',
    pickerInitialPath: 'articles',
    //pickerSelectableNodeTypes: `brxsaas:REsOHT1mlo`,
    editOnly: false,
  };

  return <Article {...{
    ...props,
    ...renderInlineEditingProps,
    document,
    articleContent,
    articleParams,
    mock,
  }} />;
};