/* eslint-disable react/display-name */
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

import React, {useMemo, useState} from 'react';
import {BrProps} from '@bloomreach/react-sdk';
import {FacetFieldFilterInput} from '@/hocs/HocTypes';
import {useBrSearch} from '@/hooks/useBrSearch';
import {BrArticle, BrSearchResults} from '@/utils/CommonTypes';
import {useRouter} from 'next/router';

export interface ContentSearchParamsType {
  keyword?: string;
  contentPageNumber?: number;
  contentPageSize?: number;
  contentSortFields?: string;
  contentFacetFieldFilters?: string | string[] | FacetFieldFilterInput | FacetFieldFilterInput[] | null;
}

export interface ContentSearchProps {
  contentSearchLoading: boolean;
  contentSearchResult: BrSearchResults<BrArticle>;
  contentSearchError: Error;
  contentSearchParameters?: string;
  contentEndpoint?: string;
  contentPageSize?: number;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

function withContentSearchBase<P extends BrProps>(
  Component: React.ComponentType<P & ContentSearchProps>,
) {
  return (props: P & ContentSearchParamsType) => {
    const {
      page,
      keyword: keywordInput,
      contentPageNumber = 1,
      contentPageSize = 12,
      contentSortFields,
      contentFacetFieldFilters,
    } = props;

    const {
      smEndpoint,
      discoveryRealm,
      contentSearchAccountId,
      contentSearchCatalogName,
    } = page?.getChannelParameters() ?? {};

    const endpoint = smEndpoint || `https://${discoveryRealm === 'STAGING' ? 'staging-' : ''}core.dxpapi.com/api/v1/core/`;

    const facetFields = process.env.NEXT_PUBLIC_CONTENT_SEARCH_FACETS!;
    const fields = process.env.NEXT_PUBLIC_CONTENT_SEARCH_FIELDS!;

    const router = useRouter();
    const currentUrl = process.env.NEXT_PUBLIC_URL + router.asPath;

    const catalogName =
      contentSearchCatalogName || process.env.NEXT_PUBLIC_CONTENT_SEARCH_CATALOG_NAME;
    const accountId = contentSearchAccountId || process.env.NEXT_PUBLIC_CONTENT_SEARCH_ACCOUNT_ID;
    const [keyword, setKeyword] = useState<string>(keywordInput ?? '');

    const params = useMemo(
      () => ({
        account_id: accountId,
        catalog_name: catalogName,
        request_type: 'search',
        search_type: 'keyword',
        rows: contentPageSize,
        start: (contentPageNumber - 1) * contentPageSize,
        fl: fields.split(','),
        q: keywordInput,
        sort: contentSortFields,
        'facet.field': facetFields,
        fq: contentFacetFieldFilters,
        url: currentUrl,
      }),
      [
        accountId,
        catalogName,
        contentPageSize,
        contentPageNumber,
        fields,
        contentSortFields,
        contentFacetFieldFilters,
        keywordInput,
        facetFields,
        currentUrl,
      ],
    );

    // Perform actual search query
    const [results, loading, error, searchParameters] = useBrSearch(endpoint, params);

    if (!keywordInput) {
      return (
        <Component
          contentSearchLoading={false}
          contentSearchResult={null}
          contentSearchError={null}
          setKeyword={setKeyword}
          contentPageSize={contentPageSize}
          {...props}
        />
      );
    }

    let contentSearchResult;
    if (!loading && !error && results) {
      contentSearchResult = results as BrSearchResults<BrArticle>;
    }

    return (
      <Component
        contentSearchLoading={loading}
        contentSearchResult={contentSearchResult}
        contentSearchError={error}
        setKeyword={setKeyword}
        contentPageSize={contentPageSize}
        contentEndpoint={endpoint}
        contentSearchParameters={searchParameters}
        {...props}
      />
    );
  };
}

export function withContentSearch<P extends BrProps>(
  Component: React.ComponentType<P & ContentSearchProps>,
) {
  return withContentSearchBase(Component);
}
