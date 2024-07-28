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
import React, {useEffect, useState} from 'react';
//mui
import {Grid} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//hocs
import {ContentSearchProps, withContentSearch} from '@/hocs/content-search/ContentSearchHoc';
import {SuggestionsProps, withSuggestions} from '@/hocs/suggestion/SuggestionsHoc';
//components
import {PopoverState} from '@/components/search-box/SearchBoxComponent';
//types
import {BrArticle, BrProduct} from '@/utils/CommonTypes';
import {AttributeSuggestion, TermSuggestion} from '@/components/search-box/SearchBoxComponentTypes';
//templates
import {
  SuggestedArticles,
  SuggestedCategories,
  SuggestedProducts,
  SuggestedTerms,
} from '@/components/auto-suggestion/templates';

export interface AutoSuggestionProps {
  input: string,
  setPopoverState: React.Dispatch<React.SetStateAction<PopoverState>>,
  //showRecentSearch: boolean,
  //showPredefinedSearches: boolean,
  //predefinedSearches: string
}

const config = require('./AutoSuggestionConfig.json');

function AutoSuggestionBase(props: BrProps & AutoSuggestionProps & ContentSearchProps & SuggestionsProps) {
  const {
    page,
    input,
    setPopoverState,
    loading,
    suggestions,
    contentSearchLoading,
    contentSearchResult,
    setKeyword,
  } = props;

  const [suggestedArticles, setSuggestedArticles] = useState<Array<BrArticle> | undefined>(undefined);

  useEffect(() => {
    if (!loading && suggestions) {
      const querySuggestions = suggestions?.suggestionGroups?.[0]?.querySuggestions;
      const firstTerm = querySuggestions?.[0]?.query;
      if (firstTerm) {
        const included = querySuggestions?.find(querySuggestion => querySuggestion.query === input);
        setKeyword(included ? input : firstTerm);
      }
    }
  }, [suggestions, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!contentSearchLoading && contentSearchResult) {
      const {
        response: {docs},
      } = contentSearchResult;
      setSuggestedArticles(docs);
    }
  }, [contentSearchResult, contentSearchLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !suggestions) {
    return null;
  }

  const {
    disableContentSuggestion = false,
    disableCategorySuggestion = false,
    disableProductSuggestion = false,
    maxSuggestionTerms = 10,
    maxSuggestionItems = 3,
  } = page.getChannelParameters();

  const querySuggestions = suggestions?.suggestionGroups?.[0]?.querySuggestions;
  const suggestionItems: Array<TermSuggestion> = querySuggestions?.filter((term) => term != null).slice(0, maxSuggestionTerms ?? config.maxSuggestionTerms);

  const attributeSuggestions = suggestions?.suggestionGroups?.[0]?.attributeSuggestions;
  const suggestionCategories: Array<AttributeSuggestion> = attributeSuggestions?.filter((attribute) => attribute?.attributeType === 'category').slice(0, maxSuggestionTerms ?? config.maxSuggestionTerms);

  const products: Array<BrProduct> | undefined = suggestions?.suggestionGroups?.[0]?.searchSuggestions?.filter((item) => item != null).slice(0, maxSuggestionItems ?? config.maxSuggestionItems);
  const articles: Array<BrArticle> | undefined = suggestedArticles?.filter((item) => item != null).slice(0, maxSuggestionItems ?? config.maxSuggestionItems);

  const hasSuggestions = suggestionItems && suggestionItems.length > 0;
  if (!hasSuggestions) {
    setPopoverState({
      input,
      showAutosuggestion: false,
    });
    return null;
  }

  let columns = 4;

  const hasArticles = articles && articles.length > 0;
  if (disableContentSuggestion || !hasArticles) {
    columns = columns - 1;
  }

  const hasSuggestionCategories = suggestionCategories && suggestionCategories.length > 0;
  if (disableCategorySuggestion || !hasSuggestionCategories) {
    columns = columns - 1;
  }

  const hasSuggestionProducts = products && products.length > 0;
  if (disableProductSuggestion || !hasSuggestionProducts) {
    columns = columns - 1;
  }

  const gridSize = 12 / columns;

  return (
    <Grid container>
      <Grid item md={columns == 4 ? gridSize - 1 : gridSize}>
        <SuggestedTerms suggestionItems={suggestionItems} input={input} />
      </Grid>
      {!disableCategorySuggestion && hasSuggestionCategories &&
        <Grid item md={columns == 4 ? gridSize - 1 : gridSize}>
          <SuggestedCategories suggestionCategories={suggestionCategories} input={input} />
        </Grid>}
      {!disableProductSuggestion && hasSuggestionProducts &&
        <Grid item md={columns == 4 ? gridSize + 1 : gridSize}>
          <SuggestedProducts products={products} />
        </Grid>}
      {!disableContentSuggestion && hasArticles &&
        <Grid item md={columns == 4 ? gridSize + 1 : gridSize}>
          <SuggestedArticles articles={articles} />
        </Grid>}
    </Grid>
  );
}

export const AutoSuggestionComponent = withContentSearch(withSuggestions(AutoSuggestionBase));
