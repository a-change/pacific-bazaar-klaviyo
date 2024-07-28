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

import {Pagination} from '@bloomreach/spa-sdk';
import {
  ListPaginationContent,
  ListPaginationParams,
  ListPaginationTemplate,
  PaginationPage,
} from './ListPaginationTypes';

import config from '@/utils/SearchConfig.json';

export interface GetListPaginationInputProps {
  offset: number;
  limit: number;
  total: number;
  params: Partial<Record<string, string | boolean | number>>;
}

export const getListPaginationContent = (props: GetListPaginationInputProps): ListPaginationContent | null => {
  const {offset, limit, total, params} = props;
  const getUrl = (pageNum: any) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryType = (params?.queryType || 'default') as string;

    const pageParameterName = config.queryParameters[queryType].pageNumber;
    urlSearchParams.set(pageParameterName, pageNum);

    const baseUrl = window.location.pathname;
    return `${baseUrl}?${urlSearchParams}`;
  };

  if (!params?.showPagination) {
    return null;
  }

  return getListPaginationInternal(offset, limit, total, getUrl);
};

export const getListPaginationContentFromBrxm = (pageable: Pagination): ListPaginationContent => {
  const offset = pageable.getOffset();
  const currentPageNumber = pageable.getCurrent().getNumber();
  const limit = currentPageNumber === 1 ? pageable.getSize() : offset / (currentPageNumber - 1);
  const total = pageable.getTotal();

  const getUrl = (pageNum: number) => {
    return pageable.getPages().find((p) => p.getNumber() === pageNum)?.getUrl() ?? '#';
  };

  return getListPaginationInternal(offset, limit, total, getUrl);
};

export const getListPaginationParams = (params: any): ListPaginationParams => {
  const template = params['template'] || 'details';
  return {
    template: template as ListPaginationTemplate,
  };
};

const getListPaginationInternal = (
  offset: number,
  limit: number,
  total: number,
  getUrl: Function,
): ListPaginationContent => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const visiblePages = 10;

  const startPage = Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const next = startPage + visiblePages < totalPages;
  const previous = startPage > 1;

  let pageNumbers: Array<PaginationPage> = [];
  for (let p = startPage; p < startPage + visiblePages && p <= totalPages; p++) {
    pageNumbers.push({
      page: p,
      pageUrl: getUrl(p),
    });
  }

  return {
    total: total,
    pageSize: limit,
    currentPage,
    previous,
    previousPageUrl: previous ? getUrl(startPage - 1) : '#',
    next,
    nextPageUrl: next ? getUrl(startPage + visiblePages) : '#',
    pageNumbers,
    visiblePages,
    startPage,
    totalPages,
    previousBatch: startPage > visiblePages,
    previousBatchLastPage: startPage - 1,
    nextBatch: startPage + visiblePages < totalPages,
    nextBatchFirstPage: startPage + visiblePages,
    endOffset: offset + limit < total ? offset + limit : total,
    offset,
    getUrl,
  };
};

