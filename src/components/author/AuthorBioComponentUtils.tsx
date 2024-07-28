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

//Bloomreach sdks
import {Page, Pagination, Reference} from '@bloomreach/spa-sdk';
//types
import {AuthorBioContent} from './AuthorBioComponentTypes';
import {AuthorBioComponentParams, AuthorBioTemplate} from '@/components/author/AuthorBioComponentTypes';
//functions
import {getImageVariants} from '@/utils/ImageUtils';
import {getSelectValue} from '@/utils/SelectUtils';

export const getAuthorBioContent = (data: any, pagination: string | Reference, page: Page): AuthorBioContent => {
  const {name, fullName, role, accounts, picture, content} = data;
  const items = pagination && page.getContent<Pagination>(pagination).getItems();
  return {
    fullName,
    role,
    info: content,
    accounts:
      accounts &&
      accounts.map((account: any) => {
        return {
          type: getSelectValue(account.type) ?? account.type,
          accountType: getSelectValue(account.accountType) ?? account.accountType,
          link: {
            url: account.link,
          },
        };
      }),
    images: getImageVariants(picture, page),
    articles: items?.map(item => {
      const document = page!.getContent(item);
      const {title, introduction, authors} = document?.getData();
      let authorName;
      if (authors?.[0]) {
        const author = page.getContent(authors?.[0]);
        authorName = author && author?.getData()?.name;
      }
      return {
        title,
        author: authorName,
        description: introduction.value,
        link: {
          url: document.getUrl()!,
        },
      };
    }).filter((article) => article.author === name),
  };
};

export const getAuthorBioParams = (params: any): AuthorBioComponentParams => {
  const template = params['template'] || 'default';

  return {
    template: template as AuthorBioTemplate,
  };
};
