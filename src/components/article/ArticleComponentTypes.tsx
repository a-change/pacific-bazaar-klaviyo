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

import React from 'react';
import {Reference} from '@bloomreach/spa-sdk';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {ImageLink, PacificLink} from '@/utils/CommonTypes';
import {AuthorBioContent} from '@/components/author/AuthorBioComponentTypes';

type BaseEntryProps = {
  type?: string,
  title: string,
  description: string
}

type ParagraphEntryProps = BaseEntryProps & {
  type: 'paragraph' | 'demoParagraph' | 'demoAlphaParagraph'
}

type CallToActionEntryProps = BaseEntryProps & {
  type: 'calltoaction' | 'demoCallToAction' | 'demoAlphaCallToAction',
  images: Partial<Record<ImageSizeEnum, ImageLink>>,
  internalLink?: PacificLink,
  externalLink?: PacificLink
}

type AIContentEntryProps = {
  type: 'demoAIContent',
  title: string,
  content: string
}

type Sidebar = {
  type: 'banner' | 'product',
  banner?: Reference,
  products?: any
}

type ArticleContent = BaseEntryProps & {
  link?: PacificLink,
  authors?: Array<AuthorBioContent>,
  tags?: Array<string>,
  entries?: Array<ParagraphEntryProps | CallToActionEntryProps | AIContentEntryProps>,
  image?: ImageLink | null,
  date?: Date | null,
  sidebars?: Array<Sidebar | null>,
  images: Partial<Record<ImageSizeEnum, ImageLink>>
}

type ArticleTemplate =
  | 'details'
  | 'card'
  | 'suggested'
  | 'listitem'
  | 'quote';

type ArticleComponentParams = {
  template: ArticleTemplate;
};

type ArticleComponentCustomProps = {
  documentRef?: Reference;
  params?: ArticleComponentParams;
  disableWrapper?: boolean;
};

type ArticleTemplateProps = {
  articleContent: ArticleContent,
  articleParams?: ArticleComponentParams
}

export type {
  BaseEntryProps,
  ParagraphEntryProps,
  CallToActionEntryProps,
  AIContentEntryProps,
  Sidebar,
  ArticleContent,
  ArticleTemplate,
  ArticleComponentCustomProps,
  ArticleComponentParams,
  ArticleTemplateProps,
};
