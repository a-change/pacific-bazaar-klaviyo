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

type PaginationPage = {
  page: number,
  pageUrl: string,
}

type ListPaginationContent = {
  endOffset: number;
  total: number,
  pageSize: number,
  currentPage: number,
  previous: boolean,
  previousPageUrl: string,
  next: boolean,
  nextPageUrl: string,
  pageNumbers: Array<PaginationPage>,
  visiblePages: number,
  startPage: number,
  totalPages: number,
  previousBatch: boolean,
  previousBatchLastPage: number,
  nextBatch: boolean,
  nextBatchFirstPage: number,
  offset: number,
  getUrl?: Function,
};

type ListPaginationTemplate =
  | 'list'
  | 'mobile'
  | 'two-button';

type ListPaginationParams = {
  template: ListPaginationTemplate;
  itemsLabel?: string;
};

type ListPaginationCustomProps = {
  documentRef?: Reference;
  params?: ListPaginationParams;
};

type ListPaginationTemplateProps = {
  listPaginationContent: ListPaginationContent,
  listPaginationParams?: ListPaginationParams
}

export type {
  PaginationPage,
  ListPaginationContent,
  ListPaginationTemplate,
  ListPaginationCustomProps,
  ListPaginationParams,
  ListPaginationTemplateProps,
};
