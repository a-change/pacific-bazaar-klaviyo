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

import {Reference} from '@bloomreach/spa-sdk';
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {ImageLink, PacificLink} from '@/utils/CommonTypes';

type SocialAccount = {
  type: string,
  accountType?: string,
  link: PacificLink
}

type ArticleByAuthor = {
  title: string,
  link: PacificLink,
  description?: string,
}

type AuthorBioContent = {
  fullName: string,
  role?: string,
  accounts?: Array<SocialAccount>,
  info?: string,
  images: Partial<Record<ImageSizeEnum, ImageLink>>,
  articles?: Array<ArticleByAuthor>,
  link?: PacificLink,
};

type AuthorBioTemplate = 'default' | 'by-line' | 'social-bar';

type AuthorBioComponentParams = {
  template: AuthorBioTemplate;
};

type AuthorBioComponentCustomProps = {
  documentRef?: Reference | string;
  params?: AuthorBioComponentParams;
  disableWrapper?: boolean;
};

type AuthorBioTemplateProps = {
  authorBioContent: AuthorBioContent;
  authorBioParams?: AuthorBioComponentParams;
}

export type {
  SocialAccount,
  AuthorBioContent,
  AuthorBioTemplate,
  AuthorBioTemplateProps,
  AuthorBioComponentParams,
  AuthorBioComponentCustomProps,
};
