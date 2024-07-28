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
import React, {useContext} from 'react';
//next
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
//mui
import {List, ListItem} from '@mui/material';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//components
import {H4, H6} from '@/components/common/bazaar/Typography';
//types
import {TermSuggestion} from '@/components/search-box/SearchBoxComponentTypes';
//functions
import {getSearchUrl, highLightSearchTerm} from '@/components/auto-suggestion/AutoSuggestionComponentUtils';
import {pushGtmEventSuggestion} from '@/components/gtm/GTMComponentUtils';

export interface SuggestionsProps {
  suggestionItems: Array<TermSuggestion>;
  input: string;
}

export const SuggestedTerms = (props: SuggestionsProps) => {
  const {suggestionItems, input} = props;
  const page = useContext(BrPageContext)!;
  const {t} = useTranslation('facet', {});

  /*
  const {
    recentSearchesState: {setRecentSearches},
  } = useContext(UserContext)!;
   */

  const hasSuggestions = suggestionItems && suggestionItems.length > 0;
  if (!hasSuggestions) {
    return null;
  }


  return (
    <List>
      <ListItem>
        <H4 sx={{fontWeight: 'bold'}}>{t('suggestions')}</H4>
      </ListItem>
      {suggestionItems?.map((suggestion, key: number) => (
        <ListItem key={`suggest-${key}`}>
          <Link
            href={page.getUrl(getSearchUrl(suggestion.query)) ?? ''}
            onClick={() => {
              //setRecentSearches(suggestion.term!);
              pushGtmEventSuggestion(suggestion.query, input);
            }}
          >
            <H6 dangerouslySetInnerHTML={{__html: highLightSearchTerm(input, suggestion.query)}} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};
