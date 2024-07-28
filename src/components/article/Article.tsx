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
import React, {useEffect} from 'react';
//bloomreach sdk
import {Content} from '@bloomreach/spa-sdk';
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {withInlineEditing} from '@/components/inline-editing-wrapper/PacificInlineEditingWrapper';
import withWrapper from '@/components/component-wrapper/PacificComponentWrapper';
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//types
import {ArticleTemplateProps} from './ArticleComponentTypes';
//templates
import {ArticleCard, ArticleDetails, ArticleListItem, ArticleQuote} from '@/components/article/templates';

interface ArticleProps {
  document: Content;
}

function ArticleBase(props: BrProps & GtmEventProps & ArticleTemplateProps & ArticleProps) {
  const {page, component, articleParams, articleContent, document, setGtmEventContent} = props;

  useEffect(() => {
    setGtmEventContent(document);
  }, [document]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (articleParams.template) {
    case 'card':
      return <ArticleCard {...{articleContent, articleParams}} />;
    case 'listitem':
      return <ArticleListItem {...{articleContent, articleParams}} />;
    case 'quote':
      return <ArticleQuote {...{articleContent, articleParams}} />;
    case 'details':
    default:
      const query = articleContent?.tags?.join(' ')?.trim() || '*';
      return <ArticleDetails query={query} pageSize={2} {...{articleContent, articleParams}} {...{page, component}} />;
  }
}

export const Article = withGtmEvent(withWrapper(withInlineEditing(ArticleBase)));