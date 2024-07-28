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

import {BrArticle, BrSearchResults} from '@/utils/CommonTypes';
import {LocationEnum} from '@/utils/CommonEnums';

type ArticleGridTemplate =
  | 'default';

type ArticleGridParams = {
  template: ArticleGridTemplate;
  title?: string;
  showTitle?: boolean;
  showFacets?: boolean;
  showPagination?: boolean;
  numberOfColumns?: number;
  pageSize?: number;
  facetsLocation?: LocationEnum;
  query?: string;
}

type ArticleGridTemplateProps = {
  articleGridContent: BrSearchResults<BrArticle>,
  articleGridParams?: ArticleGridParams
}

export type {
  ArticleGridTemplate,
  ArticleGridParams,
  ArticleGridTemplateProps,
};
